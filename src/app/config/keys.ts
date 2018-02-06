import {InjectionToken} from '@decorators/di';

export const DEF_PORT = 3000;
export const PORT = 'PORT';
export const JWT_KEY = 'JWT_KEY';
export const DEFAULT_JWT_KEY = 'secret';
export const DB = 'DATABASE';
export const DEFAULT_DB = 'xynteo-dev';
export const DB_URL = 'DB_URL';
export const DEFAULT_DB_URL = 'mongodb://localhost:27017/';
export const MONGO = new InjectionToken('MongoToken');
export const USER = 'user';
