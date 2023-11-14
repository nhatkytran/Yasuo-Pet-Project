import { ACTIONS } from './reducer';
import getService from '../../getService';

const abilitiesService = getService(ACTIONS, 'abilitiesAssets');
export default abilitiesService;
