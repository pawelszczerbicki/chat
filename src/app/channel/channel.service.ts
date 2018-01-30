import {Injectable} from '@decorators/di';
import {Channel} from './channel';
import {CHANNEL_CREATED} from '../config/keys';
import {ChannelDao} from './channel.dao';
import {SocketDao} from '../socket/socket.dao';
import {UserSocket} from '../socket/user.socket';

@Injectable()
export class ChannelService {

    constructor(private channelDao: ChannelDao, private socketDao: SocketDao) {
    }

    //TODO remove after turning on security
    async nick(userSocket: UserSocket) {
        return this.socketDao.save(userSocket);
    }

    async createChannel(channel: Channel, socket: SocketIO.Socket) {
        //TODO get user from socket if auth enabled
        let userSocket = await this.socketDao.getUserBySocket(socket.id);
        channel.users.push(userSocket.user);

        let fetched = await this.channelDao.getOrCreate(channel);
        fetched.users.forEach(u => this.joinUser(u, channel, socket));
    }

    async pushMessage(text: string, channelId: string, socketId: string) {
        //TODO get user from socket if auth enabled
        let user = (await this.socketDao.getUserBySocket(socketId)).user;
        return this.channelDao.pushMessage({text, date: new Date(), from: user}, channelId);
    }

    private async joinUser(user: string, channel: Channel, socket: SocketIO.Socket) {
        let socketId = (await this.socketDao.getSocketByUser(user)).socketId;
        socket.adapter.add(socketId, channel._id);
        socket.nsp.to(socketId).emit(CHANNEL_CREATED, channel);
    }
}