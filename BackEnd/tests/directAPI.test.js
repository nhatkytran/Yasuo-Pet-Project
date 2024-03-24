const mongoose = require('mongoose');
const Page = require('./helpers/page');

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.gotoWebsite();
});

afterEach(async () => await page.closeWebsite());

afterAll(async () => await mongoose.disconnect());

describe('User is not signed in', () => {
  test('Actions are prohibited', async () => {
    const actions = [
      {
        method: 'get',
        path: 'http://127.0.0.1:3000/api/v1/users/me',
      },
      {
        method: 'post',
        path: 'http://127.0.0.1:3000/api/v1/users/solo',
        data: {
          message: 'Yasuo challenge',
          opponentEmail: 'test@gmail.com',
        },
      },
    ];

    const results = await page.execRequests(actions);

    results.forEach(({ status }) => expect(status).toEqual('fail'));
  });
});
