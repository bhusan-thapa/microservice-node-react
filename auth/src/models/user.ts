import mongoose from 'mongoose';
import {Password} from '../utils/password';

// Interface to describe the properties required to
// create a nee User
interface UserAttrs{
    email: string;
    password: string;
    role: string;
}

// Interface to describe the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc>{
    build(attrs:UserAttrs): any;
}

// Interface that describes the properties
// that a User document has
interface UserDoc extends mongoose.Document{
    email: string;
    password: string;
    role: string;
}


const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        required: true
    }
},{
    toJSON:{
        transform(doc,ret){
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;

        }
    }
});

userSchema.pre('save',async function(done){

    if(this.isModified('password')){
        const hashed = await Password.toHash(this.get('password'));
        this.set('password',hashed);
    }
    done();
})

userSchema.statics.build=(attrs: UserAttrs)=>{
    return new User(attrs);
}
const User = mongoose.model<UserDoc,UserModel>('User',userSchema);

//Use case
// User.build({
//     email:'bhusan@gmail.com',
//     password:'sdadasdas'
// })

export {User};