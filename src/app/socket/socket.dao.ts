import {Inject, Injectable} from '@decorators/di';
import {Collection, Db} from 'mongodb';
import {UserSocket} from './user.socket';
import {MONGO} from '../config/keys';

@Injectable()
export class SocketDao {

    mongo: Collection;

    constructor(@Inject(MONGO) db: Db) {
        this.mongo = db.collection('sockets');
    }

    async save(socket: UserSocket) {
        return await this.mongo.updateOne({user: socket.user}, {'$set': {socketId: socket.socketId}}, {upsert: true});
    }

    async getSocketByUser(user: string): Promise<UserSocket> {
        return await this.mongo.findOne({user});
    }

    async getUserBySocket(socketId: string): Promise<UserSocket> {
        return await this.mongo.findOne({socketId});
    }
}