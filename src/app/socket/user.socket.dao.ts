import {Injectable} from "@decorators/di";

@Injectable()
export class UserSocketDao {
    private userSocket: Map<string, string> = new Map<string, string>();

    save(user: string, socketId: string): void {
        this.userSocket[user] = socketId;
    }

    getSocketId(user: string): string {
        return this.userSocket[user];
    }
}