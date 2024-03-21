const mongoose = require('mongoose');
const Page = require('./helpers/page');

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.gotoWebsite();
});

afterEach(async () => await page.closeWebsite());

afterAll(async () => await mongoose.disconnect());

describe('Google Authentication', () => {
  test('The page opens and has correct text', async () => {
    const text = await page.getContentOf('.sh-footer__text-left');

    expect(text).toEqual('The unforgiven');
  });

  test('Clicking signin starts oauth flow', async () => {
    await page.loginFormOpen();
    await page.evaluateClick('.login-form__options-google');
    await page.waitForNavigation({ url: /accounts/ });

    expect(await page.url()).toMatch(/accounts\.google\.com/);
  });

  test('When signed in, shows logout button', async () => {
    await page.loginOAuth();

    const text = await page.getContentOf('.sub-header__content-logout-title');

    expect(text).toEqual('Sign out');
  });
});

describe('Local Authentication', () => {
  beforeEach(async () => await page.loginFormOpen());

  test('Enter invalid inputs!', async () => {
    await page.type('#login-form-username', 'username');
    await page.type('#login-form-password', 'asd123AA$');
    await page.evaluateClick('.login-form__body-button');

    await page.waitForSelector('.toast.toast-fail');

    const text = await page.getContentOf(
      '.login-form__header-warning-message-fail'
    );

    expect(text).toEqual('Incorrect username or password!');
  });

  test('Enter valid inputs!', async () => {
    await page.loginLocal();

    const text = await page.getContentOf('.sub-header__content-logout-title');

    expect(text).toEqual('Sign out');
  });
});

describe('Signing out', () => {
  test('Clicking sign out button, see signin button', async () => {
    await page.loginOAuth();
    await page.evaluateClick('.sub-header__content-logout');
    await page.waitForSelector('.toast.toast-success');

    const text = await page.getContentOf('.sub-header__content-login-title');

    expect(text).toEqual('Sign in');
  });
});
