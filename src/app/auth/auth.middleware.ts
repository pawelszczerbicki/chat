import {Middleware} from '@decorators/socket/src';
import * as socketJwt from 'socketio-jwt';
import {getProp} from '../config/config';
import {DEFAULT_JWT_KEY, JWT_KEY, USER} from '../config/keys';
import {SocketDao} from '../socket/socket.dao';
import {Injectable} from '@decorators/di';
import Socket = SocketIO.Socket;

const token: string = 'decoded_token';
const username: string = 'user_name';

@Injectable()
export class AuthMiddleware implements Middleware {
    private readonly authorizer;

    constructor(private socketDao: SocketDao) {
        this.authorizer = socketJwt.authorize({secret: getProp(JWT_KEY, DEFAULT_JWT_KEY), handshake: true});
    }

    public use(io, socket: Socket, next) {
        this.authorizer(socket, async (...args) => {
            if (socket[token]) {
                await this.socketDao.upsert({user: socket[token][username], socketId: socket.id});
                socket[USER] = socket[token][username];
            }
            next(...args);
        });
    }
}