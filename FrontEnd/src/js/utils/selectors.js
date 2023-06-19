export const $ = document.querySelector.bind(document);
export const $$ = document.querySelectorAll.bind(document);
export const $_ = (node, selector) => node.querySelector(selector);
export const $$_ = (node, selector) => node.querySelectorAll(selector);
