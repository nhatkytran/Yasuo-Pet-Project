import { ACTIONS } from './reducer';
import getService from '../../getService';

const subwebService = getService(ACTIONS, 'video');
export default subwebService;
