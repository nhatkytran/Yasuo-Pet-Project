import { ADD, REMOVE, SPEAKER_STATE, DRAG_VOLUME } from '../config';
import { classRemove } from '../utils';

// This helps write less code and make code more reusable in View
// With controller we need to implement structure to call functions in View

export const dragAndDropEvent = (node, mouseActions) =>
  Object.entries(mouseActions).forEach(([key, mouseAction]) => {
    if (key === 'mousedown') return node.addEventListener(key, mouseAction);
    if (key === 'touchstart')
      return node.addEventListener(key, mouseAction, { passive: true });
    document.addEventListener(key, mouseAction);
  });

const calculateVolume = (progressBar, progressWrapper) =>
  (progressBar / progressWrapper) * 100;

export const checkVolumeFactory =
  (progressBarNode, progressWrapperNode) => () =>
    calculateVolume(
      progressBarNode.getBoundingClientRect().width,
      progressWrapperNode.getBoundingClientRect().width
    );

export const renderVolumeFactory = (progressBarNode, speakers) => volume => {
  // Progress
  progressBarNode.style.width = `${volume}%`;

  // Speaker'state --> Muted | Slow | Medium | High
  const speakerIndex = Math.ceil((volume / 100) * SPEAKER_STATE);

  speakers.forEach((speaker, index) =>
    classRemove(speakerIndex === index ? REMOVE : ADD, speaker)
  );
};

export const adjustVolumeFactory = videoNode => volume =>
  (videoNode.volume = volume / 100);

export const calculateNewVolumeFactory =
  progressWrapperNode => (event, action) => {
    let clientX = event.clientX || event.touches[0].clientX;

    const {
      left,
      right,
      width: progressWrapper,
    } = progressWrapperNode.getBoundingClientRect();

    if (action === DRAG_VOLUME) {
      if (clientX < left) clientX = left;
      if (clientX > right) clientX = right;
    }

    return calculateVolume(clientX - left, progressWrapper);
  };
