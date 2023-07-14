const sideIndices = (currentIndex, length, lengthFloor = null) => {
  // if `lengthFloor` is `null` --> Ceil (Right side)
  return (_, index) => {
    let shouldIndex = index + currentIndex;
    if (lengthFloor !== null) shouldIndex += length - lengthFloor;
    if (shouldIndex >= length) shouldIndex %= length;

    return shouldIndex;
  };
};

export default sideIndices;
