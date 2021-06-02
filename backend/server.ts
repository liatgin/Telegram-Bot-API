import * as express from 'express';

const app = express.default()
const serverPort = parseInt(process.env.PORT || '8081');

export const angularAppServing = () => {
    app.use('/', express.static('dist/chat-bot-messages'));
    app.listen(serverPort, () => {
        console.log('app is started and listening to port:', serverPort)
    })
}