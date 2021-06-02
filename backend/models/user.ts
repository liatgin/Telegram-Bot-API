import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    email:  {
        type: String,
        required: true,
        index: true
    },
    telegramId: {
        type: Number,
        required: true,
        index: true
    },
    messagesCount: {
        type: Number,
        required: true
    },
    conversationsCount: {
        type: Number,
        required: true
    },
    currConversationStartTime: {
        type: Number,
        required: true
    },
    totalConversationsDuration: {
        type: Number,
        required: true
    }
});

const User = mongoose.model('User', userSchema)
export {User}