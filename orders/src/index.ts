import mongoose, { NativeBuffer } from 'mongoose';
import {app} from './app';
import {natsWrapper} from './nats-wrapper';
import {ProductCreatedListener} from './events/listeners/product-created-listener';
import {ProductUpdatedListener} from './events/listeners/product-updated-listener';
import {PaymentCreatedListener} from './events/listeners/payment-created-listener';
const start = async ()=>{
    if(!process.env.JWT_KEY){
        throw new Error('JWT_KEY must be defined');
    }
    if(!process.env.MONGO_URI){
        throw new Error('MONGO_URI must be defined');
    }
    if(!process.env.NATS_CLIENT_ID){
        throw new Error('NATS_CLIENT_ID must be defined');
    }
    if(!process.env.NATS_URL){
        throw new Error('NATS_URL must be defined');
    }
    if(!process.env.NATS_CLUSTER_ID){
        throw new Error('NATS_CLUSTER_ID must be defined');
    }
    try{
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID,process.env.NATS_CLIENT_ID,process.env.NATS_URL);
        natsWrapper.client.on('close',()=>{
            console.log('NATS connection closed!!');
            process.exit();
        });
        process.on('SIGINT',()=>natsWrapper.client.close());
        process.on('SIGTERM',()=> natsWrapper.client.close());

        new ProductCreatedListener(natsWrapper.client).listen();
        new ProductUpdatedListener(natsWrapper.client).listen();
        new PaymentCreatedListener(natsWrapper.client).listen();

        
        await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('connected to database');
    }catch(err){
        console.error('err',err)
    }
    app.listen(4000,()=>{
        console.log('Order server running on 4000!!!')
    })
    
};

start();