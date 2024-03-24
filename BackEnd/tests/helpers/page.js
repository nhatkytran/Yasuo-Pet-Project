const puppeteer = require('puppeteer');

const { userFactory, deleteUserFactory } = require('../factories/userFactory');
const sessionFactory = require('../factories/sessionFactory');

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

  // On Frontend code, we need to wait for the server to boost up (onrender)
  async waitServerRunning() {
    await this.page.waitForSelector('.toast.toast-welcome');
  }

  async gotoWebsite() {
    await this.page.goto('http://127.0.0.1:8080', {
      waitUntil: 'domcontentloaded',
    });
    await this.page.setViewport({ width: 1140, height: 1024 });
    await this.waitServerRunning();
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

  async setSessionCookie(session) {
    await this.page.setCookie({ name: 'connect.jest', value: session });
  }

  async loginOAuth() {
    this.user = await userFactory();
    const session = await sessionFactory(this.user);

    await this.setSessionCookie(session);
    await this.page.goto('http://127.0.0.1:8080', {
      waitUntil: 'domcontentloaded',
    });
    await this.waitServerRunning();
  }

  async loginLocal() {
    this.user = await userFactory();
    const { username, password } = this.user;

    await this.page.type('#login-form-username', username);
    await this.page.type('#login-form-password', password);
    await this.evaluateClick('.login-form__body-button');

    await this.page.waitForSelector('.toast.toast-success');
  }

  async getContentOf(selector) {
    return this.page.$eval(selector, el => el.innerHTML);
  }

  async getValueOf(selector) {
    return this.page.$eval(selector, input => input.value);
  }

  async evaluateClick(selector) {
    await this.page.evaluate(
      sel => document.querySelector(sel).click(),
      selector
    );
  }

  async get(path) {
    return this.page.evaluate(
      async (_path, _metadata) => {
        const response = await fetch(_path, _metadata);
        return await response.json();
      },
      path,
      apiOptions('GET')
    );
  }

  async post(path, data) {
    return this.page.evaluate(
      async (_path, _metadata) => {
        const response = await fetch(_path, _metadata);
        return await response.json();
      },
      path,
      apiOptions('POST', { body: JSON.stringify(data) })
    );
  }

  execRequests(actions) {
    return Promise.all(
      actions.map(({ method, path, data }) => this[method](path, data))
    );
  }
}

const apiOptions = (method, metadata = {}) => {
  return {
    method: method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    timeout: 30000,
    ...metadata,
  };
};

module.exports = Page;
