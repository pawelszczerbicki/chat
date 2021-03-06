# Chat app
Chat app written in `Typescript`, `NodeJS` and `socket.io`.

## Development
`npm run dev` app will be listening on `http://localhost:3000` with hot reload

## Usage
Connect to websocket on path `http://localhost:3000`
User have to be authenticated using JWT provided in query string.

## Socket events
**Client** - event send by client    
**Server** - event send by server    

`createChannel`  
Send this event to create conversation between people  
**Client:** `{users: ['test']}`, where users is list of users you want to talk to  

`message`  
Sends message  
**Client:**  `{to: 'channelId', text: 'Hello'}`  
**Server:** `{HISTORY}` 

`channelCreated`  
Event is send by server when channel is successfully created  
**Server:** `{_id: "someid", users: ['test']}`  

`channelHistory`  
Get history for channel  
**Client:** `{channelId: 'channelId', pager: {page:1, size: 10}`  
**Server:** `[{HISTORY}]`  

`conversations`  
Get conversations for current user  
**Client:** empty payload  
**Server:** `{_id: 'channelId'}, users: ['test'], history: [{HISTORY}]` history - one or zero elements

## Objects
### HISTORY
`{from: 'some', date: '2018-01-30 16:50:04.714', text: 'Hello'}`
