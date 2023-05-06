export const $ = document.querySelector.bind(document);
export const $$ = document.querySelectorAll.bind(document);

export const $_ = (node, selector) => node.querySelector(selector);
export const $$_ = (node, selector) => node.querySelectorAll(selector);

export const BACKEND_URL = 'http://127.0.0.1:3000';
export const FETCH_API_TIMEOUT = 30;
