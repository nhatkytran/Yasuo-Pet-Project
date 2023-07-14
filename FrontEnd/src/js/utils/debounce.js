const debounce = (fn, timeout = 0, this_ = null) => {
  let timeoutID;

  return (...args) => {
    clearTimeout(timeoutID);

    timeoutID = setTimeout(() => {
      fn.apply(this_, args);
    }, timeout);
  };
};

export default debounce;
