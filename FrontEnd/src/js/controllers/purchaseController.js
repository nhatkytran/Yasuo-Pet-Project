import {
  ANIMATION_TIMEOUT,
  CONTENT,
  ERROR,
  LOADING,
  TOAST_FAIL,
} from '../config';

import { catchAsync } from '../utils';

import store from '../models/store';
import skinsService from '../models/features/skins/skinsService';
import { ACTIONS } from '../models/features/skins/reducer';
import userService from '../models/features/user/userService';

import ModalContentController from './modalContentController';

const filename = 'purchaseController.js';

const stripe = Stripe(
  'pk_test_51MbOACI8uPqtxRMLapqSYKjWHI0tKVlNTHmbRyNTS4hYvUFByFqlwevrAFo8y8bBXdGwcwIV1odoal2DjrA7bRzo007ZwXM2hW'
);

class PurchaseController extends ModalContentController {
  #PurchaseView;
  #ToastView;
  #handleOpenModal;
  #handleCloseModal;

  constructor(PurchaseView, ToastView, handleOpenModal, handleCloseModal) {
    super();
    this.#PurchaseView = PurchaseView;
    this.#ToastView = ToastView;
    this.#handleOpenModal = handleOpenModal;
    this.#handleCloseModal = handleCloseModal;
  }

  handleOpenPurchaseView = index => {
    const skins = store.state.skins.skins;
    const skinData = skins[index];
    const skinRelatesData = [index - 1, index + 1, index + 2].map(idx => {
      const trueIndex = (idx + skins.length) % skins.length;
      return { ...skins[trueIndex], trueIndex };
    });

    super.open(
      this.#handleOpenModal,
      this.#PurchaseView.open.bind(
        this.#PurchaseView,
        skinData,
        skinRelatesData
      )
    );
  };

  handleClosePurchaseView = () =>
    super.close(this.#handleCloseModal, this.#PurchaseView.close);

  handleSkinRelates = index => {
    super.close(this.#handleCloseModal, this.#PurchaseView.close);
    setTimeout(
      () => this.#PurchaseView.openPurchaseViewSignal(index),
      ANIMATION_TIMEOUT * 2
    );
  };

  handleData = catchAsync({
    filename,
    onProcess: async () => {
      if (!store.state.skins.ok) {
        this.#PurchaseView.displayContent(LOADING);

        await skinsService.getData('/api/v1/skins/data');
        store.dispatch(ACTIONS.setDataOk());
      }

      this.#PurchaseView.displayContent(CONTENT);
      this.#PurchaseView.openPurchaseViewSignal(0); // 0 -> First skin as default
    },
    onError: () => {
      this.#PurchaseView.displayContent(ERROR);
      this.#ToastView.createToast(store.state.toast[TOAST_FAIL]);
    },
  });

  handlerPurchaseSkin = catchAsync({
    filename,
    onProcess: async skinIndex => {
      const session = await userService.purchaseSkin(
        `/api/v1/users/checkoutSession/${skinIndex}`
      );

      console.log(stripe);
      console.log(stripe.redirectToCheckout);

      await stripe.redirectToCheckout({ sessionId: session.id });
    },
    onError: error => {},
  });
}

export default PurchaseController;
