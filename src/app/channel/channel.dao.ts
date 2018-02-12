import {Channel} from './channel';
import {Inject, Injectable} from '@decorators/di';
import {Collection} from 'mongodb';
import {MONGO} from '../config/keys';
import {History} from '../message/history';
import {ObjectID} from 'bson';
import {Page} from '../page/page';
import {ChannelDetails} from './channel.details';

@Injectable()
export class ChannelDao {
    mongo: Collection;

    constructor(@Inject(MONGO) private db) {
        this.mongo = db.collection('channel');
    }

    getHistory(channelId: string, user: string, page: Page) {
        return this.mongo.findOne<Channel>({_id: new ObjectID(channelId), users: user},
            {projection: {history: {'$slice': [(page.page - 1) * page.size, page.size]}}});
    }

    async getOrCreate(channel: Channel): Promise<ChannelDetails> {
        channel.users.sort();
        const {users} = channel;
        if ((await this.mongo.count({users}) < 1))
            await this.mongo.insertOne({users});
        return (await this.joinAndFilterUsers(users).toArray())[0];
    }

    conversations(users: string) {
        return this.mongo.find<Channel>({users}).sort({lastMessage: 1}).project({history: {'$slice': -1}}).toArray();
    }

    pushMessage(msg: History, id: string) {
        return this.mongo.updateOne({_id: new ObjectID(id), users: msg.from},
            {'$push': {history: msg}, '$set': {lastMessage: msg.date}});
    }

    private joinAndFilterUsers(users) {
        return this.mongo.aggregate<ChannelDetails>([
            {$match: {users}},
            {$unwind: '$users'},
            {$lookup: {from: 'user', localField: 'users', foreignField: 'email', as: 'users'}},
            {$project: {users: {email: 1, name: 1, surname: 1, avatarUrl: 1}}}
        ]);
    }
}
