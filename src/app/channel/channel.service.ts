import {Injectable} from '@decorators/di';
import {Channel} from './channel';
import {CHANNEL_CREATED} from '../config/events';
import {ChannelDao} from './channel.dao';
import {SocketDao} from '../socket/socket.dao';
import {Page} from '../page/page';
import {History} from '../message/history';
import {USER} from '../config/keys';

@Injectable()
export class ChannelService {

    constructor(private channelDao: ChannelDao, private socketDao: SocketDao) {
    }

    async createChannel(channel: Channel, socket: SocketIO.Socket) {
        channel.users.push(socket[USER]);

        const fetched = await this.channelDao.getOrCreate(channel);
        fetched.users.forEach(u => this.joinUser(u, fetched, socket));
    }

    async pushMessage(text: string, channelId: string, user: string): Promise<History> {
        const msg: History = {text, date: new Date(), from: user};
        const matched = (await this.channelDao.pushMessage(msg, channelId)).matchedCount;
        return matched > 0 ? Promise.resolve(msg) : Promise.reject('User not in channel');
    }

    channelHistory(id: string, page: Page, user: string) {
        return this.channelDao.getHistory(id, user, page);
    }

    conversations(user: string) {
        return this.channelDao.conversations(user);
    }

    removeSocket(socketId: string) {
        this.socketDao.removeSocket(socketId);
    }

    private async joinUser(user: string, channel: Channel, socket: SocketIO.Socket) {
        const socketId = await this.socketDao.getSocketByUser(user);
        socket.adapter.add(socketId, channel._id);
        socket.nsp.to(socketId).emit(CHANNEL_CREATED, channel);
    }
}
