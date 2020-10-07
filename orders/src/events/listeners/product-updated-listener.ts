import {Message} from 'node-nats-streaming';
import {Listener, ProductUpdatedEvent,Subjects} from '@gazmer-ecomm2/common';
import {queueGroupName} from './queue-group-name';
import { Product } from '../../models/product';
export class ProductUpdatedListener extends Listener<ProductUpdatedEvent>{
    subject:Subjects.ProductUpdated = Subjects.ProductUpdated;
    queueGroupName = queueGroupName;
    
    async onMessage(data:ProductUpdatedEvent['data'],msg: Message){

        const {title,price,id,version} = data;
        const product = await Product.findByEvent(data)
        if(!product){
            throw new Error('Product not found');
        }
        product.set({title,price});
        await product.save();

        msg.ack();

    }
}

