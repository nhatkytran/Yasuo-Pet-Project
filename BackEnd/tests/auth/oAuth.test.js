const puppeteer = require('puppeteer');

jest.setTimeout(30 * 1000);

let browser, page;

// beforeEach(async () => {
//   browser = await puppeteer.launch({
//     headless: false, // headless by default is run -> run without GUI
//   });

//   page = await browser.newPage();

//   await page.goto('http://127.0.0.1:8080');
//   await page.setViewport({ width: 1140, height: 1024 });
// });

// afterEach(async () => await browser.close());

//

test('the page opens and has correct text', async () => {
  const text = await page.$eval('.sh-footer__text-left', el => el.innerHTML);

  expect(text).toEqual('The unforgiven');
});

test('clicking signin starts oauth flow', async () => {
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

// test.only('***', () => {});
