const mongoose = require('mongoose');
const puppeteer = require('puppeteer');

let browser, page;

// On Frontend code, we need to wait for the server to boost up (onrender)
const waitServerRunning = () =>
  new Promise(resolve => setTimeout(resolve, 1000));

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: false, // headless by default is run -> run without GUI
  });

  page = await browser.newPage();

  await page.goto('http://127.0.0.1:8080');
  await page.setViewport({ width: 1140, height: 1024 });

  await waitServerRunning();
});

afterEach(async () => await browser.close());

afterAll(async () => await mongoose.disconnect());

// // npm run devj

test('The page opens and has correct text', async () => {
  const text = await page.$eval('.sh-footer__text-left', el => el.innerHTML);

  expect(text).toEqual('The unforgiven');
});

test('Clicking signin starts oauth flow', async () => {
  await page.click('.sub-header__content-login');

  // Wait for signin form opens
  await page.waitForSelector('.login-form__header-title');

  // Authenticate using google
  await page.evaluate(() =>
    document.querySelector('.login-form__options-google').click()
  );

  await page.waitForNavigation({ url: /accounts/ });

  const url = await page.url();

  expect(url).toMatch(/accounts\.google\.com/);
});

test('When signed in, shows logout button', async () => {
  const session =
    '65f9a002cd7a70124dd6bb66.6856a9fb566796657e73f77c6862c3adee80d5278766ec5fcddcc8c605440145';

  await page.setCookie({ name: 'connect.jest', value: session });

  await page.goto('http://127.0.0.1:8080');
  await waitServerRunning();

  const text = await page.$eval(
    '.sub-header__content-logout-title',
    el => el.innerHTML
  );

  expect(text).toEqual('Sign out');
});

test.only('***', () => {
  const User = mongoose.model('User');
  console.log(User);
  expect(1).toEqual(1);
});
