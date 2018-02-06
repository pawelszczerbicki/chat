import {History} from '../message/history';

export interface Channel {
    _id: string;
    users: string[];
    history: History[];
}
