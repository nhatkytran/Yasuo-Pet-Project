import { ACTIONS } from './reducer';
import getService from '../../getService';

const galleryService = getService(ACTIONS, 'galleryAssets');
export default galleryService;
