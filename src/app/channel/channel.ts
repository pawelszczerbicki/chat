import {MessageHistory} from '../message/message.history';

export interface Channel {
    _id: string;
    users: string[];
    history: MessageHistory[];
}