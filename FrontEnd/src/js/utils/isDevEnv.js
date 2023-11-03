import { ENV } from '../config';

const isDevEnv = () => ENV === 'development';
export default isDevEnv;
