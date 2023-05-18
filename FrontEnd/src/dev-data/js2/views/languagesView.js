import { $, $$ } from '../config.js';

class LanguagesView {
  _parentElement = $('.languages-list');
  _languages = $$('.languages-language');
  _paragraphContainer = $('.information-yasuo__about-story');
  _storyButton = $('.information-yasuo__about-story--see-more');
  _storyDots = $('.information-yasuo__about-story--dots');

  _render(paragraph) {
    this._paragraphContainer.removeChild(
      this._paragraphContainer.firstElementChild
    );
    this._paragraphContainer.insertAdjacentHTML(
      'afterbegin',
      this._generateMarkup(paragraph)
    );
  }

  _generateMarkup(paragraph) {
    return `
      <span>${paragraph}</span>
    `;
  }

  _handleChecked(id) {
    this._languages.forEach((item, index) => {
      if (index === id) {
        item.classList.add('checked');
      } else {
        item.classList.remove('checked');
      }
    });
  }

  handleLanguages(id, paragraph) {
    this._handleChecked(id);
    this._render(paragraph);
  }

  addHandlerChooseLanguage(handler) {
    this._parentElement.addEventListener('click', function (event) {
      const link = event.target.closest('.languages-link');

      if (link) handler(+link.dataset.language);
    });
  }

  handleSeeMore() {
    this._storyButton.classList.add('hide');
    this._storyDots.classList.add('hide');
  }

  addHandlerSeeMore(handler) {
    this._storyButton.addEventListener('click', function () {
      handler();
    });
  }
}

export default new LanguagesView();
