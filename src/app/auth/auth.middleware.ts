import {Middleware} from "@decorators/socket/src";
import * as socketJwt from 'socketio-jwt'
import {getProp} from "../config/config";
import {DEFAULT_JWT_KEY, JWT_KEY} from "../config/keys";
import {UserSocketDao} from "../socket/user.socket.dao";
import Socket = SocketIO.Socket;
import {Injectable} from "@decorators/di";

const token: string = 'decoded_token';
const username: string = 'user_name';

@Injectable()
export class AuthMiddleware implements Middleware {
    private authorizer;

    constructor(private userSocketDao: UserSocketDao) {
        this.authorizer = socketJwt.authorize({secret: getProp(JWT_KEY, DEFAULT_JWT_KEY), handshake: true})
    }

    public use(io, socket: Socket, next) {
        //TODO add auth after test phase
        next();
        // this.authorizer(socket, (...args) => {
        //     if (socket[token]) this.userSocketDao.save(socket[token][username], socket.id);
        //     next(...args);
        // });
    }
}