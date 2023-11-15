const debounce = (fn, timeout = 0, this_) => {
  let timeoutID;

  return (...args) => {
    clearTimeout(timeoutID);
    timeoutID = setTimeout(fn.bind(this_, ...args), timeout);
  };
};

export default debounce;
