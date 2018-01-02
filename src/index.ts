import {Args, attachControllers, Controller, Event, Socket} from '@decorators/socket';
import {Injectable} from "@decorators/di";

@Injectable()
@Controller('/')
export class Index {

    @Event('message')
    onMessage(@Args() msg, @Socket() socket: SocketIO.Socket) {
        console.log(`Message:  ${msg}`);
        socket.send(msg)
    }

}