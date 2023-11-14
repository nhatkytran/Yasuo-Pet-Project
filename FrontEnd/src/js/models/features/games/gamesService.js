import { ACTIONS } from './reducer';
import getService from '../../getService';

const gamesService = getService(ACTIONS, 'exploreGamesAssets');
export default gamesService;
