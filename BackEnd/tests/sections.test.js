const mongoose = require('mongoose');
const Page = require('./helpers/page');

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.gotoWebsite();
});

afterEach(async () => await page.closeWebsite());

afterAll(async () => await mongoose.disconnect());

// Test
test.only('***', async () => {
  expect(1).toEqual(1);
});

describe("Fetch each section's data", () => {
  test('Scroll to Skins section and see images of all skins', async () => {
    await page.evaluate(() => {
      const sectionTop = document
        .querySelector('#section-skins')
        .getBoundingClientRect().top;
      const more = 0;
      const mainHeaderHight = 70;

      window.scrollTo({
        top: window.scrollY + sectionTop - mainHeaderHight - more,
        behavior: 'smooth',
      });
    });

    await page.waitForSelector('.toast.toast-skins');

    const text = await page.getContentOf('.skins-overlay__about-who-name');

    expect(text).toEqual('YASUO - THE UNFORGIVEN');
  });
});

describe('Send Yasuo challenge email', () => {
  const enterInputsAndSend = async () => {
    await page.type('#solo-message', 'Yasuo The King Challenge');
    await page.type('#solo-email', 'yasuotheking2@gmail.com');
    await page.evaluateClick('.solo-form__button');
  };

  describe('When not signed in', () => {
    test('Get error when sending email', async () => {
      await enterInputsAndSend();
      await page.waitForSelector('.toast.toast-fail');
    });
  });

  describe('When signed in', () => {
    beforeEach(async () => await page.loginOAuth());

    test('The session is invalid so get kicked out', async () => {
      await page.setSessionCookie('');
      await enterInputsAndSend();
      await page.waitForSelector('.toast.toast-fail');
      await page.waitForNavigation();

      const text = await page.getContentOf('.sub-header__content-login-title');

      expect(text).toEqual('Sign in');
    });

    test('Sending email is successful', async () => {
      await enterInputsAndSend();
      await page.waitForSelector('.toast.toast-success');

      const message = await page.getValueOf('#solo-message');
      const email = await page.getValueOf('#solo-email');

      expect(message).toEqual('');
      expect(email).toEqual('');
    });
  });
});
