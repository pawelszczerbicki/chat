import {Channel} from './channel';
import {Inject, Injectable} from '@decorators/di';
import {Collection} from 'mongodb';
import {MONGO} from '../config/keys';
import {MessageHistory} from '../message/message.history';
import {ObjectID} from 'bson';

@Injectable()
export class ChannelDao {
    mongo: Collection;

    constructor(@Inject(MONGO) private db) {
        this.mongo = db.collection('channel');
    }

    async getOrCreate(channel: Channel): Promise<Channel> {
        channel.users.sort();
        return (await this.mongo.findOneAndUpdate({users: channel.users}, channel, {upsert: true, returnOriginal: false})).value;
    }

    async pushMessage(msg: MessageHistory, id: string) {
        return await this.mongo.updateOne({_id: new ObjectID(id)}, {'$push': {history: msg}});
    }
}