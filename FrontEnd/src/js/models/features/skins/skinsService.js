import { ACTIONS } from './reducer';
import getService from '../../getService';

const skinsService = getService(ACTIONS, 'skinsAssets');
export default skinsService;
