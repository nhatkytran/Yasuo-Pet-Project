const capitalizeWordsInSentence = sentence =>
  sentence
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

export default capitalizeWordsInSentence;
