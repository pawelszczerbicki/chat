import {Args, attachControllers, Controller, Event, Socket} from '@decorators/socket';
import {Injectable} from '@decorators/di';
import {UserSocketDao} from './socket/user.socket.dao';
import {ChannelDao} from './channel/channel.dao';
import {Channel} from './channel/channel';
import {CHANNEL_CREATED, CREATE_CHANNEL, MESSAGE} from './config/keys';

@Injectable()
@Controller('/')
export class Index {

    constructor(private channelDao: ChannelDao, private userSocketDao: UserSocketDao) {
    }

    @Event(MESSAGE)
    onMessage(@Args() msg: Message, @Socket() socket: SocketIO.Socket) {
        socket.nsp.to(msg.to).emit('message', msg.text);
    }

    @Event('nick')
    //TODO test method because auth is turned off
    nickname(@Args() msg, @Socket() socket: SocketIO.Socket) {
        this.userSocketDao.save(msg.nick, socket.id);
    }

    @Event(CREATE_CHANNEL)
    createChannel(@Args() channel: Channel, @Socket() socket: SocketIO.Socket) {
        channel.id = this.channelDao.channelId(channel);
        socket.join(channel.id, () => socket.emit(CHANNEL_CREATED, channel));
        channel.users.forEach(u => {
            let id = this.userSocketDao.getSocketId(u);
            socket.adapter.add(id, channel.id);
            socket.to(id).emit(CHANNEL_CREATED, channel);
        });
    }
}