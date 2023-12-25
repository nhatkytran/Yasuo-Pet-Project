import { CONTENT, ERROR, LOADING, TOAST_FAIL } from '../config';
import { catchAsync } from '../utils';

import store from '../models/store';
import skinsService from '../models/features/skins/skinsService';
import { ACTIONS } from '../models/features/skins/reducer';

import ModalContentController from './modalContentController';

const filename = 'purchaseController.js';

class PurchaseController extends ModalContentController {
  #PurchaseView;
  #ToastView;

  constructor(PurchaseView, ToastView) {
    super();
    this.#PurchaseView = PurchaseView;
    this.#ToastView = ToastView;
  }

  handleOpenPurchaseView = index => {
    const skins = store.state.skins.skins;
    const skinData = skins[index];
    const skinRelatesData = [index - 1, index + 1, index + 2].map(
      idx => skins[(idx + skins.length) % skins.length]
    );
    this.#PurchaseView.open(skinData, skinRelatesData);
  };

  handleClosePurchaseView = () => this.#PurchaseView.close();

  handleData = catchAsync({
    filename,
    onProcess: async () => {
      if (!store.state.skins.ok) {
        this.#PurchaseView.displayContent(LOADING);

        await skinsService.getData('/api/v1/skins/data');
        store.dispatch(ACTIONS.setDataOk());
      }

      this.#PurchaseView.displayContent(CONTENT);
      this.#PurchaseView.openPurchaseViewSignal(0); // 0 -> First skin as default
    },
    onError: () => {
      this.#PurchaseView.displayContent(ERROR);
      this.#ToastView.createToast(store.state.toast[TOAST_FAIL]);
    },
  });
}

export default PurchaseController;
