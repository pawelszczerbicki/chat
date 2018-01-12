import {Middleware} from "@decorators/socket/src";
import * as socketJwt from 'socketio-jwt'
import {getProp} from "../config/config";
import {DEFAULT_JWT_KEY, JWT_KEY} from "../config/keys";
import Socket = SocketIO.Socket;

export class AuthMiddleware implements Middleware {
    private authorizer;

    constructor() {
        this.authorizer = socketJwt.authorize({secret: getProp(JWT_KEY, DEFAULT_JWT_KEY), handshake: true})
    }

    public use(io, socket: Socket, next) {
        //TODO enable authorization after dev phase !!!!!!!!!!!!!!!
        // return this.authorizer(socket, next);
        return next()
    }
}