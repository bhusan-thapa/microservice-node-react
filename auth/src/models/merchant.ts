import mongoose from 'mongoose';
import {Password} from '../utils/password';

// Interface to describe the properties required to
// create a nee User
interface MerchantAttrs{
    email: string;
    password: string;
    role: string;
}

// Interface to describe the properties
// that a User Model has
interface MerchantModel extends mongoose.Model<MerchantDoc>{
    build(attrs:MerchantAttrs): any;
}

// Interface that describes the properties
// that a User document has
interface MerchantDoc extends mongoose.Document{
    email: string;
    password: string;
    role: string;
}


const merchantSchema = new mongoose.Schema({
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

merchantSchema.pre('save',async function(done){

    if(this.isModified('password')){
        const hashed = await Password.toHash(this.get('password'));
        this.set('password',hashed);
    }
    done();
})

merchantSchema.statics.build=(attrs: MerchantAttrs)=>{
    return new Merchant(attrs);
}
const Merchant = mongoose.model<MerchantDoc,MerchantModel>('Merchant',merchantSchema);

//Use case
// User.build({
//     email:'bhusan@gmail.com',
//     password:'sdadasdas'
// })

export {Merchant};