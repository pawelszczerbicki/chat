import {Args, attachControllers, Controller, Event, Socket} from '@decorators/socket';
import {Injectable} from '@decorators/di';
import {Channel} from './channel/channel';
import {CREATE_CHANNEL, MESSAGE} from './config/keys';
import {ChannelService} from './channel/channel.service';

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
}