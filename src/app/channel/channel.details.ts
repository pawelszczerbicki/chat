import {History} from '../message/history';
import {User} from '../user/user';

export interface ChannelDetails {
    _id: string;
    users: User[];
    history: History[];
}
