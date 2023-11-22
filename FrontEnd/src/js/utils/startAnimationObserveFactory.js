const startAnimationObserveFactory = (elements, timeout) => () =>
  elements.forEach((element, index) =>
    setTimeout(() => {
      element.classList.remove('hide');
      element.classList.add('fade-in-500');

      setTimeout(() => element.classList.remove('fade-in-500'), timeout);
    }, index * timeout)
  );

export default startAnimationObserveFactory;
