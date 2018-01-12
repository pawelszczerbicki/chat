import * as express from 'express';
import {DEF_PORT, PORT} from "./config/keys";
import * as log from "winston";
import {getProp} from "./config/config";
import {createServer, Server} from 'http';
import * as socketIo from 'socket.io';
import {attachControllers, IO_MIDDLEWARE, Middleware} from "@decorators/socket";
import {Index} from './index';
import {Container, Injectable} from "@decorators/di";
import {AuthMiddleware} from "./auth/auth.middleware";

@Injectable()
export class App {
    private server: Server;
    private socket: SocketIO.Server;
    private port: number;

    constructor() {
        this.server = createServer(express());
        this.socket = socketIo(this.server);
        this.port = getProp(PORT, DEF_PORT);
    }

    attachControllers() {
        attachControllers(this.socket, [Index])
    }

    start() {
        this.attachControllers();
        this.server.listen(this.port, () => log.info(`App started on port ${this.port}`))
    }
}

log.configure({
    level: 'debug',
    transports: [new log.transports.Console({colorize: true})]
});

Container.provide([{provide: IO_MIDDLEWARE, useClass: AuthMiddleware}]);

Container.get<App>(App).start();
