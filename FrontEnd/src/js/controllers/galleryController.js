import { CONTENT, LOADING, ERROR } from '../config';
import { checkEmptyObject } from '../utils';
import state, { fetchGalleryData } from '../model';

class GalleryController {
  #galleryView;

  constructor(galleryView) {
    this.#galleryView = galleryView;
  }

  #fetchData = async () => {
    try {
      this.#galleryView.displayContent(LOADING);

      const data = await fetchGalleryData();

      console.log(data);

      await this.#galleryView.createGallery(data.gallery);

      state.galleryData = data;
    } catch (error) {
      // test
      console.error('Something went wrong!');
      console.error(error);

      this.#galleryView.displayContent(ERROR);
    }
  };

  handleData = async () => {
    if (checkEmptyObject(state.galleryData)) await this.#fetchData();
    if (!checkEmptyObject(state.galleryData))
      this.#galleryView.displayContent(CONTENT);
  };
}

export default GalleryController;
