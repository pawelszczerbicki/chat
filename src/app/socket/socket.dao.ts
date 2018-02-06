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

    upsert(socket: UserSocket) {
        return this.mongo.updateOne({user: socket.user}, {'$set': {socketId: socket.socketId}}, {upsert: true});
    }

    removeSocket(socketId: string) {
        this.mongo.deleteOne({socketId});
    }

    async getSocketByUser(user: string) {
        return (await this.mongo.findOne<UserSocket>({user}))!.socketId;
    }
}
