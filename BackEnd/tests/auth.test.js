const mongoose = require('mongoose');
const Page = require('./helpers/page');

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.gotoWebsite();
});

afterEach(async () => await page.closeWebsite());

afterAll(async () => await mongoose.disconnect());

// Google Authentication

test('The page opens and has correct text', async () => {
  const text = await page.getContentOf('.sh-footer__text-left');

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
  await page.loginOAuth();

  const text = await page.getContentOf('.sub-header__content-logout-title');

  expect(text).toEqual('Sign out');
});

// Local Authentication
