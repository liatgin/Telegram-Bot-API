import telegram from 'node-telegram-bot-api';
import { User } from './models/user';
import { dbConnect } from './dbConfig/dbConnector';


class UserController {

    constructor() {    
        dbConnect();
    }

    // Users starts a new conversation
    async startConversation(msg: telegram.Message) {
        const email = msg.text?.split(' ')[1]
        const user = await User.find({email: email})
        // User doesnt exist, creating a new user
        if (user.length == 0) {
            let user = new User({
                email, 
                telegramId: msg.from?.id,
                messagesCount: 1,
                conversationsCount: 1,
                currConversationStartTime: msg.date,
                totalConversationsDuration: 0
            })
            await user.save()
        }
        // User already exists so we will update him
        else {
            const filter =  {email: email}
            const update: any = {$set: {currConversationStartTime: msg.date, telegramId: msg.from?.id}, $inc: {messagesCount: 1, conversationsCount: 1}}
            await User.updateOne(filter, update, null, (err, res) => {})
        }
    }

    // User's wrote a new message 
    async newMessage(msg: telegram.Message) {
        const filter =  {telegramId: msg.from?.id}
        const update: any = {$inc: {messagesCount: 1}}
        await User.updateOne(filter, update, null, (err, res) => {})
    }

    // Returns user's conversations metadata:
    // 1. Number of conversations
    // 2. Average duration of a conversation
    async conversationInfo(msg: telegram.Message) {
        const user = await User.find({telegramId: msg.from?.id})
        const conversationsNumberUntillNow =  user[0].conversationsCount - 1 // Not including the currrent conversation
        let avgDuration
        if (conversationsNumberUntillNow == 0) { // there is only one conversation - the current one 
            avgDuration = msg.date - user[0].currConversationStartTime
        } else {
            avgDuration = user[0].totalConversationsDuration / conversationsNumberUntillNow
        }
        const filter =  {telegramId: msg.from?.id}
        const update: any = {$inc: {messagesCount: 1}}
        await User.updateOne(filter, update, null, (err, res) => {})
        return [user[0].messagesCount, avgDuration];           
    }

    // The user ends its current conversation
    async endConversation(msg: telegram.Message) {
        const user = await User.find({telegramId: msg.from?.id})
        const filter =  {telegramId: msg.from?.id}
        const duration = msg.date - user[0].currConversationStartTime
        const update: any = {$set: { telegramId: null },  $inc: {messagesCount: 1, totalConversationsDuration: duration}}
        await User.updateOne(filter, update, null, (err, res) => {})
    }

    // User message that hasn't include one of the known commands from predefined commands set 
    async unFamiliarMessage(msg: telegram.Message) {
        const filter =  {telegramId: msg.from?.id}
        const update: any = {$inc: {messagesCount: 1}}
        await User.updateOne(filter, update, null, (err, res) => {})
    }
  }
  
  export = new UserController();