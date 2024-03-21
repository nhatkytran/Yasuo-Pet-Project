const puppeteer = require('puppeteer');

const { userFactory, deleteUserFactory } = require('../factories/userFactory');
const sessionFactory = require('../factories/sessionFactory');

// On Frontend code, we need to wait for the server to boost up (onrender)
const waitServerRunning = () =>
  new Promise(resolve => setTimeout(resolve, 1000));

class Page {
  static async build() {
    const browser = await puppeteer.launch({
      headless: false, // headless by default is run -> run without GUI
    });

    const page = await browser.newPage();
    const customPage = new Page(page);

    return new Proxy(customPage, {
      get(target, property, receiver) {
        if (target[property]) return target[property];

        const value = page[property];

        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy#examples
        if (value instanceof Function)
          return function (...args) {
            return value.apply(this === receiver ? page : this, args);
          };

        return value;
      },
    });
  }

  constructor(page) {
    this.page = page;
  }

  async gotoWebsite() {
    await this.page.goto('http://127.0.0.1:8080', {
      waitUntil: 'domcontentloaded',
    });
    await this.page.setViewport({ width: 1140, height: 1024 });
    await waitServerRunning();
  }

  async closeWebsite() {
    // Authentication will create a random user
    if (this.user) await deleteUserFactory(this.user.id);

    await this.page.browser().close();
  }

  async loginFormOpen() {
    await this.evaluateClick('.sub-header__content-login');
    await this.page.waitForSelector('.login-overlay', { visible: true });
  }

  async loginOAuth() {
    this.user = await userFactory();
    const session = await sessionFactory(this.user);

    await this.page.setCookie({ name: 'connect.jest', value: session });
    await this.page.goto('http://127.0.0.1:8080', {
      waitUntil: 'domcontentloaded',
    });
    await waitServerRunning();
  }

  async getContentOf(selector) {
    return this.page.$eval(selector, el => el.innerHTML);
  }

  async loginLocal() {
    this.user = await userFactory();
    const { username, password } = this.user;
    console.log(username, password);

    await this.page.type('#login-form-username', username);
    await this.page.type('#login-form-password', password);
    await this.evaluateClick('.login-form__body-button');

    await this.page.waitForSelector('.toast.toast-success');
  }

  async evaluateClick(selector) {
    await this.page.evaluate(
      sel => document.querySelector(sel).click(),
      selector
    );
  }
}

module.exports = Page;
