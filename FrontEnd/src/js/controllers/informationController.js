class InformationController {
  #InformationView;

  constructor(InformationView) {
    this.#InformationView = InformationView;
  }

  handleStartAnimation = () => this.#InformationView.startAnimationObserve();
}

export default InformationController;
