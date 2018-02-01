import {InjectionToken} from '@decorators/di';

export const DEF_PORT: number = 3000;
export const PORT: string = 'PORT';
export const JWT_KEY: string = 'JWT_KEY';
export const DEFAULT_JWT_KEY: string = 'secret';
export const MESSAGE: string = 'message';
export const CREATE_CHANNEL: string = 'createChannel';
export const CHANNEL_HISTORY: string = 'channelHistory';
export const CHANNEL_CREATED: string = 'channelCreated';
export const DB: string = 'DATABASE';
export const DEFAULT_DB: string = 'xynteo-dev';
export const DB_URL: string = 'DB_URL';
export const DEFAULT_DB_URL: string = 'mongodb://localhost:27017';
export const MONGO = new InjectionToken('MongoToken');
