import { ACTIONS } from './reducer';
import getService from '../../getService';

const allgamesService = getService(ACTIONS, 'allGamesAssets');
export default allgamesService;
