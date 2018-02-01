# Chat app
Chat app written in `Typescript`, `NodeJS` and `socket.io`.

## Development
`npm run dev` app will be listening on `http://localhost:3000`

## Usage
Connect to websocket on path `http://localhost:3000`
User have to be authenticated using JWT provided in query string.

### Socket events
**Client** - event send by client
**Server** - event send by server<br />

`nick` <br/>
Send this event to login user. METHOD IS TEMPORARY !!! Will be removed<br/>
**Client:** `{nick: 'some'}`<br/> <br/>

`createChannel`<br/>
Send this event to create conversation between people <br/>
**Client:** `{users: ['test']}`, where users is list of users you want to talk to <br/><br/>

`message` <br/>
Sends message <br/>
**Client:**  `{to: 'channelId', text: 'Hello'}` <br/>
**Server:** just send text - Will be improved <br/><br/>

`channelCreated` <br/>
Event is send by server when channel is successfully created <br/>
**Server:** `{_id: "someid", users: ['test']}` <br/><br/>

`channelHistory` <br/>
Get history for channel <br/>
**Client:** `{channelId: 'channelId', pager: {page:1, size: 10}` <br/>
**Server:** `[from: 'some', date: '2018-01-30 16:50:04.714', text: 'Hello']`
