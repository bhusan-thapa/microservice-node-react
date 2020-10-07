import nats, {Message, Stan} from 'node-nats-streaming';
import {randomBytes} from 'crypto';

import {ProductCreatedListener} from './events/product-created-listener';
console.clear();
const stan = nats.connect('ecomm2',randomBytes(4).toString('hex'),{
    url:'http://localhost:4222'
});

stan.on('connect',()=>{
    console.log('Listerner connected to NATS');
    stan.on('close',()=>{
        console.log('Nats connxn closed');
        process.exit();
    })
    new ProductCreatedListener(stan).listen();
})

process.on('SIGINT',()=>stan.close());
process.on('SIGTERM',()=>stan.close());




