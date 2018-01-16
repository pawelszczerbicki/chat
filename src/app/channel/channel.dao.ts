import {Channel} from "./channel";
import {Injectable} from "@decorators/di";

@Injectable()
export class ChannelDao {

    channelId(channel: Channel) {
        return Math.random().toString(36).substr(2, 15);
    }
}