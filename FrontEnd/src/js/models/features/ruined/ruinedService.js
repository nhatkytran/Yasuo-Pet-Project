import { ACTIONS } from './reducer';
import getService from '../../getService';

const ruinedService = getService(ACTIONS, 'ruinedAssets');
export default ruinedService;
