import mongoose from 'mongoose';

const questionSchema =new  mongoose.Schema({
    question: String,
    answer: {type:String},
    userId: String
});

export {questionSchema as Question};