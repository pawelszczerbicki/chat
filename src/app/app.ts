import * as express from 'express';
import {DB, DB_URL, DEF_PORT, DEFAULT_DB, DEFAULT_DB_URL, MONGO, PORT} from './config/keys';
import * as log from 'winston';
import {getProp} from './config/config';
import {createServer, Server} from 'http';
import * as socketIo from 'socket.io';
import {attachControllers, IO_MIDDLEWARE, Middleware} from '@decorators/socket';
import {Index} from './index';
import {AuthMiddleware} from './auth/auth.middleware';
import {MongoClient} from 'mongodb';
import {Container} from '@decorators/di';
import {ChannelDetails} from './channel/channel.details';


log.configure({level: 'debug', transports: [new log.transports.Console({colorize: true})]});
process.on('unhandledRejection', log.error);
process.on('uncaughtException', log.error);

class App {
    private readonly server: Server;
    private readonly io: SocketIO.Server;

    constructor() {
        this.server = createServer(express());
        this.io = socketIo(this.server);
    }

    start(port: number) {
        MongoClient.connect(getProp(DB_URL, DEFAULT_DB_URL))
            .then(client => this.configureContainer(client))
            .then(() => this.server.listen(port, () => log.info(`App started on port ${port}`)))
            .catch(log.error);
    }

    private configureContainer(client: MongoClient) {
        Container.provide([{provide: MONGO, useValue: client.db(getProp(DB, DEFAULT_DB))}]);
        Container.provide([{provide: IO_MIDDLEWARE, useClass: AuthMiddleware}]);
        attachControllers(this.io, [Index]);
    }
}

new App().start(getProp(PORT, DEF_PORT));
