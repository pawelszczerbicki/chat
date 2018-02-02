import {Ack, Args, attachControllers, Controller, Disconnect, Event, Socket} from '@decorators/socket';
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

    @Disconnect()
    onDisconnect(@Socket() socket: SocketIO.Socket) {
        this.channelService.removeSocket(socket.id);
    }

    @Event(MESSAGE)
    async onMessage(@Args() msg: Message, @Socket() socket, @Ack() ack) {
        //TODO workaround, issue https://github.com/serhiisol/node-decorators/issues/85
        if (typeof ack !== 'function') {
            let temp = ack;
            ack = socket;
            socket = temp;
        }
        let history = await this.channelService.pushMessage(msg.text, msg.to, socket.id);
        socket.to(msg.to).emit(MESSAGE, history);
        ack(msg.id);
    }

    @Event(CREATE_CHANNEL)
    createChannel(@Args() channel: Channel, @Socket() socket: SocketIO.Socket) {
        return this.channelService.createChannel(channel, socket);
    }

    @Event(CHANNEL_HISTORY)
    async channelHistory(@Args() req: HistoryRequest, @Socket() socket: SocketIO.Socket) {
        socket.emit(CHANNEL_HISTORY, (await this.channelService.channelHistory(req.channelId, req.pager, socket.id))!.history);
    }

    @Event(CONVERSATIONS)
    async conversations(@Socket() socket: SocketIO.Socket) {
        socket.emit(CONVERSATIONS, await this.channelService.conversations(socket.id));
    }
}