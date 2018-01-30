import {MessageHistory} from '../message/message.history';

export interface Channel {
    id: string;
    users: string[];
    history: MessageHistory[];
}