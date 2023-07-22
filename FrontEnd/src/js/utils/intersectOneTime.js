const intersectOneTime = (section, options, handler) => {
  const callback = (entries, observerSelf) => {
    if (entries[0].isIntersecting) {
      handler();
      observerSelf.disconnect();
    }
  };

  const observer = new IntersectionObserver(callback, options);
  observer.observe(section);
};

export default intersectOneTime;
