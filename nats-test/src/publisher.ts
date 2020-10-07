import nats from 'node-nats-streaming';
import {ProductCreatedPublisher} from './events/product-created-publisher';
console.clear();
const stan = nats.connect('ecomm2','abc',
{
    url: 'http://localhost:4222'
});

stan.on('connect',async ()=>{
    console.log('publisher connected to NATS');
    const publisher = new ProductCreatedPublisher(stan);
    try{
        await publisher.publish({
            id:'123',
            title:'abc',
            price:90
        })
    }catch(err){
        console.log(err);
    }
    

})