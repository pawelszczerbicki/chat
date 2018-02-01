import {Channel} from './channel';
import {Inject, Injectable} from '@decorators/di';
import {Collection} from 'mongodb';
import {MONGO} from '../config/keys';
import {History} from '../message/history';
import {ObjectID} from 'bson';
import {Page} from '../page/page';

@Injectable()
export class ChannelDao {
    mongo: Collection;

    constructor(@Inject(MONGO) private db) {
        this.mongo = db.collection('channel');
    }

    getHistory(channelId: string, user: string, page: Page) {
        return this.mongo.findOne<Channel>({_id: new ObjectID(channelId), users: user},
            {projection: {history: {'$slice': [page.skip(), page.size]}}});
    }

    async getOrCreate(channel: Channel): Promise<Channel> {
        channel.users.sort();
        let {users} = channel;
        return (await this.mongo.findOneAndUpdate({users}, {'$set': {users}}, {upsert: true, returnOriginal: false})).value;
    }

    conversations(users: string) {
        return this.mongo.find<Channel>({users}).sort('lastMessage').project({history: {'$slice': 1}});
    }

    pushMessage(msg: History, id: string): Promise<any> {
        return this.mongo.updateOne({_id: new ObjectID(id)}, {'$push': {history: msg}, '$set': {lastMessage: msg.date}});
    }
}