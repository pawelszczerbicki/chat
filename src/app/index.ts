import {Args, attachControllers, Controller, Event, Socket} from '@decorators/socket';
import {Injectable} from '@decorators/di';
import {Channel} from './channel/channel';
import {CHANNEL_HISTORY, CREATE_CHANNEL, MESSAGE} from './config/keys';
import {ChannelService} from './channel/channel.service';
import {HistoryRequest} from './message/history.request';

@Injectable()
@Controller('/')
export class Index {

    constructor(private channelService: ChannelService) {
    }

    //todo check if user is in channel
    @Event(MESSAGE)
    onMessage(@Args() msg: Message, @Socket() socket: SocketIO.Socket): void {
        this.channelService.pushMessage(msg.text, msg.to, socket.id);
        socket.nsp.to(msg.to).emit('message', msg.text);
    }

    //TODO add leave room msg
    //TODO test method because auth is turned off
    @Event('nick')
    nickname(@Args() msg, @Socket() socket: SocketIO.Socket) {
        return this.channelService.nick({user: msg.nick, socketId: socket.id});
    }

    @Event(CREATE_CHANNEL)
    createChannel(@Args() channel: Channel, @Socket() socket: SocketIO.Socket) {
        return this.channelService.createChannel(channel, socket);
    }

    @Event(CHANNEL_HISTORY)
    async channelHistory(@Args() request: HistoryRequest, @Socket() socket: SocketIO.Socket) {
        let history = await this.channelService.channelHistory(request.channelId, request.pager, socket.id);
        socket.emit(CHANNEL_HISTORY, history);
    }
}