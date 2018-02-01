import {Args, attachControllers, Controller, Event, Socket} from '@decorators/socket';
import {Injectable} from '@decorators/di';
import {Channel} from './channel/channel';
import {CHANNEL_HISTORY, CONVERSATIONS, CREATE_CHANNEL, MESSAGE} from './config/events';
import {ChannelService} from './channel/channel.service';
import {HistoryRequest} from './message/history.request';

@Injectable()
@Controller('/')
export class Index {

    constructor(private channelService: ChannelService) {
    }

    //todo check if user is in channel
    @Event(MESSAGE)
   async onMessage(@Args() msg: Message, @Socket() socket: SocketIO.Socket) {
        let history = await this.channelService.pushMessage(msg.text, msg.to, socket.id);
        //TODO send message with from, date, 
        socket.to(msg.to).emit('message', history);
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
        socket.emit(CHANNEL_HISTORY, (await this.channelService.channelHistory(request.channelId, request.pager, socket.id))!.history);
    }

    @Event(CONVERSATIONS)
    async conversations(@Socket() socket: SocketIO.Socket) {
        socket.emit(CONVERSATIONS, await this.channelService.conversations(socket.id));
    }
}