const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const validator = require('validator');
const bcrypt = require('bcrypt');
const multer = require('multer');
const sharp = require('sharp');
const Stripe = require('stripe');

const {
  AppError,
  Email,
  catchAsync,
  hashToken,
  isStrongPassword,
  sendSuccess,
} = require('../utils');

const {
  cloudinaryUploader,
  cloudinaryDestroyer,
} = require('../config/cloudinary');

const { User, Skins } = require('../models');

const { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } = process.env;

exports.getMe = (req, res, next) =>
  sendSuccess(res, { metadata: { user: req.user } });

exports.sendSolo = catchAsync(async (req, res, next) => {
  const { message, opponentEmail } = req.body;

  if (message.trim().length > 300)
    throw new Error("You message's max length is 300 characters!", 400);
  if (!validator.isEmail(opponentEmail))
    throw new Error('Please provide a valid opponentEmail!', 400);

  const user = req.user;

  try {
    await new Email({ email: opponentEmail }).sendSolo({
      challengerName: user.username,
      challengerEmail: user.email,
      challengerMessage: message,
    });
  } catch (error) {
    throw new AppError(
      'Something went wrong sending email! Please try again.',
      500
    );
  }

  sendSuccess(res, {
    metadata: { message: 'Email has been sent successfully!' },
  });
});

exports.getActivateCode = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!validator.isEmail(email))
    throw new AppError('Please provide a valid email!', 400);

  const user = await User.findOne({ email });

  if (!user)
    throw new AppError(
      `Incorrect email!`,
      400,
      'ACTIVATE_AUTHENTICATION_ERROR'
    );

  if (user.googleID || user.facebookID || user.githubID || user.appleID)
    throw new AppError(
      'This feature only supports accounts created manually!',
      403,
      'ACTIVATE_OAUTH_ERROR'
    );

  if (user.active)
    throw new AppError(
      'User is already active! Login now.',
      400,
      'ACTIVATE_ACTIVE_ERROR'
    );

  const activateToken = await user.createActivateToken();
  await user.save({ validateModifiedOnly: true });

  try {
    await new Email(user).sendActivateCode(activateToken);
  } catch (error) {
    user.activateToken = undefined;
    user.activateTokenAt = undefined;

    await user.save({ validateModifiedOnly: true });

    throw new AppError(
      'Something went wrong sending email! Please try again.',
      500
    );
  }

  sendSuccess(res, {
    metadata: { message: 'Token has been sent! Please check your email.' },
  });
});

exports.activateAccount = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    activateToken: hashToken(req.body.token),
    activateTokenAt: { $gt: Date.now() },
  });

  if (!user)
    throw new AppError(
      'Invalid token or token has expired!',
      401,
      'ACTIVATE_TOKEN_ERROR'
    );

  user.active = true;
  user.activateToken = undefined;
  user.activateTokenAt = undefined;

  await user.save({ validateModifiedOnly: true });

  sendSuccess(res, { metadata: { message: 'Activate account successfully!' } });
});

exports.forgotUsername = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!validator.isEmail(email))
    throw new AppError('Please provide a valid email!', 400);

  const user = await User.findOne({ email });

  if (!user)
    throw new AppError(
      `Incorrect email!`,
      400,
      'FORGOT_USERNAME_AUTHENTICATION_ERROR'
    );

  try {
    await new Email(user).sendForgotUsername();
  } catch (error) {
    throw new AppError(
      'Something went wrong sending email! Please try again.',
      500
    );
  }

  sendSuccess(res, {
    metadata: { message: 'Username has been sent! Please check your email.' },
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!validator.isEmail(email))
    throw new AppError('Please provide a valid email!', 400);

  const user = await User.findOne({ email });

  if (!user)
    throw new AppError(
      `Incorrect email!`,
      400,
      'FORGOT_PASSWORD_AUTHENTICATION_ERROR'
    );

  if (user.googleID || user.facebookID || user.githubID || user.appleID)
    throw new AppError(
      'Only get password of accounts created manually!',
      403,
      'FORGOT_PASSWORD_OAUTH_ERROR'
    );

  const forgotPasswordToken = await user.createForgotPasswordToken();
  await user.save({ validateModifiedOnly: true });

  try {
    await new Email(user).sendForgotPassword(forgotPasswordToken);
  } catch (error) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenAt = undefined;

    await user.save({ validateModifiedOnly: true });

    throw new AppError(
      'Something went wrong sending email! Please try again.',
      500,
      'FORGOT_PASSWORD_SEND_EMAIL_ERROR'
    );
  }

  sendSuccess(res, {
    metadata: {
      message: 'Password reset code has been sent! Please check your email.',
    },
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword)
    throw new Error('Please provide token and newPassword!', 400);

  if (!isStrongPassword(newPassword))
    throw new AppError(
      'Password must contain at least 8 characters (1 uppercase, 1 lowercase, 1 number, 1 symbol)',
      400
    );

  const user = await User.findOne({
    forgotPasswordToken: hashToken(token),
    forgotPasswordTokenAt: { $gt: Date.now() },
  });

  if (!user)
    throw new AppError(
      'Invalid token or token has expired!',
      401,
      'FORGOT_PASSWORD_TOKEN_ERROR'
    );

  user.password = newPassword;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordTokenAt = undefined;

  await user.save({ validateModifiedOnly: true });

  sendSuccess(res, { metadata: { message: 'Change password successfully!' } });
});

exports.changePassword = catchAsync(async (req, res, next) => {
  const { email, currentPassword, newPassword } = req.body;

  if (!validator.isEmail(email))
    throw new AppError('Please provide a valid email!', 400);

  const user = await User.findOne({ email }).select('+password');

  if (!user) throw new AppError('Email does not exist!', 404);

  if (user.googleID || user.facebookID || user.githubID || user.appleID)
    throw new AppError(
      'This feature only supports accounts created manually!',
      403,
      'ACTIVATE_OAUTH_ERROR'
    );

  if (!isStrongPassword(currentPassword) || !isStrongPassword(newPassword))
    throw new AppError(
      'Password must contain at least 8 characters (1 uppercase, 1 lowercase, 1 number, 1 symbol)',
      400
    );

  if (!(await bcrypt.compare(currentPassword, user.password)))
    throw new AppError(
      'The current password is incorrect! Please try again.',
      400,
      'CHANGE_PASSWORD_INCORRECT_ERROR'
    );

  if (await bcrypt.compare(newPassword, user.password))
    throw new AppError(
      'The new password is the same as the current one!',
      400,
      'CHANGE_PASSWORD_INCORRECT_ERROR'
    );

  user.password = newPassword;
  await user.save({ validateModifiedOnly: true });

  sendSuccess(res, { metadata: { message: 'Change password successfully!' } });
});

const multerStorage = multer.memoryStorage();

const multerFilter = (_, file, cb) =>
  file.mimetype.startsWith('image')
    ? cb(null, true)
    : cb(new AppError('Not an image! Please update only images.', 400), false);

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadUserPhoto = upload.single('photo');

const filePathPhoto = fileName =>
  path.join(__dirname, '..', 'public', 'img', 'users', fileName);

exports.resizeUserPhoto = catchAsync(async (req, _, next) => {
  if (!req.file) throw new Error('Something went wrong!');

  const fileName = `user-avatar-${req.user._id}-${Date.now()}.jpeg`;
  const filePath = filePathPhoto(fileName);

  await sharp(req.file.buffer)
    .resize(252, 252)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(filePath);

  const { secure_url } = await cloudinaryUploader(filePath);

  req.file.filePath = filePath;
  req.file.cloudinarySecureURL = secure_url;
  next();
});

exports.deleteOldUserPhoto = async (req, res, next) => {
  try {
    // Delete photo created in file system
    await fs.unlink(req.file.filePath);

    // Delete photo on Cloudinary
    // https://res.cloudinary.com/dxo1gnffi/image/upload/v1711353587/qjkcdmlpxrvhtkexevy3.jpg
    if (req.user.photo !== '/img/default.png') {
      const cloudinaryPublicID = req.user.photo.split('/').at(-1).split('.')[0];
      await cloudinaryDestroyer(cloudinaryPublicID);
    }
  } catch (error) {
    console.error(error);
  } finally {
    next();
  }
};

exports.changePhoto = catchAsync(async (req, res, next) => {
  const photo = req.file.cloudinarySecureURL;

  await User.findByIdAndUpdate(
    req.user._id,
    { photo },
    { new: true, runValidators: true }
  );

  sendSuccess(res, {
    metadata: { message: 'Change avatar successfully!', photo },
  });
});

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const userID = req.user._id.toString();
  const skinIndex = Number.parseInt(req.params.skinIndex);

  const [data] = await Skins.find().cacheRedis();

  const skin = data.skins[skinIndex];
  if (!skin) return next(new Error());

  const baseUrl = `${req.protocol}://${req.get('host')}`;

  const actionUrl = state =>
    `${baseUrl}/api/v1/users/checkout/${userID}/${state}/${skinIndex}`;

  // successUrl is also monkey patched in Webhook
  // 2 situations: have skinReceiptParam and do not
  const successUrl = actionUrl('success');
  const cancelUrl = actionUrl('cancel');

  const stripe = Stripe(STRIPE_SECRET_KEY);
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: req.user.email,
    client_reference_id: skinIndex,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: skin.price * 100,
          product_data: {
            name: skin.name,
            description: `${skin.details[0].slice(0, 64)}...`,
            images: [`${baseUrl}${skin.image}`],
          },
        },
      },
    ],
  });

  res.status(200).json({ status: 'success', session });
});

const createSkinCheckout = async session => {
  const skinIndex = Number.parseInt(session.client_reference_id);

  const user = await User.findOne({ email: session.customer_email });

  const [data] = await Skins.find();
  const skin = data.skins[skinIndex];

  const isSkinPurchasedBefore = user.purchasedSkins.some(
    skin => skin.index === skinIndex
  );

  let userPurchasedSkins;
  const receiptNumber = Date.now();
  const skinCode = crypto.randomBytes(6).toString('hex');

  const skinReceipt = {
    receipt: `#${receiptNumber}`,
    code: skinCode,
    date: receiptNumber,
    active: false,
  };

  if (!isSkinPurchasedBefore) {
    const newSkin = {
      index: skinIndex,
      name: skin.name,
      price: skin.price,
      description: `${skin.details[0].slice(0, 64)}...`,
      image: skin.image,
      quantity: 1,
      skins: [skinReceipt],
    };

    userPurchasedSkins = [...user.purchasedSkins, newSkin];
    userPurchasedSkins.sort((a, b) => a.index - b.index);
  } else {
    userPurchasedSkins = [...user.purchasedSkins].map(skn => {
      if (skn.index === skinIndex) {
        skn.quantity += 1;
        skn.skins.push(skinReceipt);
      }

      return skn;
    });
  }

  await User.findByIdAndUpdate(
    user.id,
    { purchasedSkins: userPurchasedSkins },
    { new: true, runValidators: true }
  );

  await new Email(user).sendPurchasedSkinCode({
    skinname: skin.name,
    code: skinCode,
  });
};

exports.webhookCheckout = async (req, res) => {
  try {
    const stripe = Stripe(STRIPE_SECRET_KEY);

    const event = stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'],
      STRIPE_WEBHOOK_SECRET
    );

    if (event.type === 'checkout.session.completed')
      createSkinCheckout(event.data.object);

    res.status(200).json({ received: true });
  } catch (err) {
    res.status(400).send(`Webhook error: ${err.message}`);
  }
};

exports.getCheckoutState = async (req, res, next) => {
  try {
    const { userID, state, skinIndexParam, skinReceiptParam } = req.params;

    const skinIndex = Number.parseInt(skinIndexParam);
    const skinReceipt = skinReceiptParam ? `#${skinReceiptParam}` : '';

    const user = await User.findById(userID);
    if (!user) throw new AppError('User not found!', 404);

    let skinObject;

    if (skinReceiptParam)
      skinObject = user.purchasedSkins
        .find(skn => skn.index === skinIndex)
        .toObject();
    else {
      const [data] = await Skins.find().cacheRedis();
      if (!data) throw new AppError('Data not found!', 404);

      skinObject = data.skins[skinIndex];
    }

    const skinInfo = skinReceiptParam
      ? skinObject.skins.find(info => info.receipt === skinReceipt)
      : {};

    const { name, price, description, image } = skinObject;
    const { receipt, date } = skinInfo;

    const skin = {
      name,
      price: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(price),
      description,
      image,
      receipt,
      date:
        date &&
        date.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
    };

    res.status(200).render('checkout', { state, user, skin });
  } catch (error) {
    console.error(error);
    res.status(200).render('error');
  }
};
