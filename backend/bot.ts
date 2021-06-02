import telegram from 'node-telegram-bot-api';
import axios from 'axios';
import { angularAppServing } from './server';
import { socketsConfig } from './socketIOConfig';
import UserController  from './usersController'
import dotenv from 'dotenv';
dotenv.config()

const COMMANDS = {
    START: /\/start/,
    FREE_TEXT: /\/freetext/,
    GET_INFO: /\/getinfo/,
    END: /\/end/
}
const DIFFERENT_COMMAND_REGEX = `^(?!.*/start)(?!.*/freetext)(?!.*/getinfo)(?!.*/end).*$`
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_TOKEN

class Bot {

    private bot: telegram
    private io

    constructor() {
        this.init()
        this.bot = this.createBot();
        this.io = socketsConfig();
        this.configBotCommands();
    }

    // Serving static files
    init() {
        angularAppServing();
    }

    configBotCommands() {

        this.bot.onText(COMMANDS.START, async (msg: telegram.Message) => {
            this.sendMessageToClient(msg, 'Hi, how can i help you today?\nAvailable commands are: /start, /freetext, /getinfo, /end')
            UserController.startConversation(msg)
        });

        this.bot.onText(COMMANDS.FREE_TEXT, async (msg: telegram.Message) => {
            axios.get('https://api.kanye.rest/')
                .then((response) => {
                    this.sendMessageToClient(msg, response.data.quote)
                });
    
                UserController.newMessage(msg)  
        });
    
        this.bot.onText(COMMANDS.GET_INFO, async (msg: telegram.Message) => {
            let usrNumberOfMessages
            let averageDuration
    
            [usrNumberOfMessages , averageDuration] = await UserController.conversationInfo(msg)
            this.sendMessageToClient(msg, `Total Number of messages are: ${usrNumberOfMessages}\nAvarage conversation time is ${averageDuration}`)   
        });
    
        this.bot.onText(COMMANDS.END, async (msg: telegram.Message) => {       
            UserController.endConversation(msg)
            this.sendMessageToClient(msg, 'OK, we are done here')
        });
    
        this.bot.onText(new RegExp(DIFFERENT_COMMAND_REGEX), async (msg) => {        
            UserController.unFamiliarMessage(msg)
            this.sendMessageToClient(msg, "Sorry, didn't get it.")
        });
    
        this.bot.on('message', (msg: telegram.Message) => {
            const message = {
                isBot: false,
                userName: msg.from?.last_name ? `${msg.from?.first_name} ${msg.from?.last_name}` : `${msg.from?.first_name}`,
                date: msg.date,
                text: msg.text
            }
            this.io.emit("message", { message });
        });
    }

    // Initialization of a new Telegram Bot instance
    createBot() {
        const telegramBot = new telegram(<string>TELEGRAM_BOT_TOKEN, {
            polling: true
        })
        return telegramBot
    }

    // Sending message to the client using Sockets.io
    sendMessageToClient(msg: telegram.Message, msgText: string) {
        this.bot.sendMessage(
            msg.chat.id,
            msgText
        );
        const message = {
            isBot: true,
            date: msg.date,
            text: msgText
        }
        this.io.emit("message", { message });
    }
}

const BotInstance = new Bot()