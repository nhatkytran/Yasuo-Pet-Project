class MainHeaderController {
  #mainHeaderView;

  constructor(MainHeaderView) {
    this.#mainHeaderView = MainHeaderView;
  }

  handleToggleSticky = isSticky => this.#mainHeaderView.toggleSticky(isSticky);

  handleSurfSections = section => this.#mainHeaderView.scrollToSection(section);
}

export default MainHeaderController;
