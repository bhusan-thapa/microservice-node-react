import {Message} from 'node-nats-streaming';
import {Listener} from './base-listener';
import {ProductCreatedEvent} from './product-created-event';
import {Subjects} from './subjects';
export class ProductCreatedListener extends Listener<ProductCreatedEvent>{
    // subject: Subjects.ProductCreated = Subjects.ProductCreated;
    readonly subject = Subjects.ProductCreated;
    queueGroupName= 'order-service';

    onMessage(data:ProductCreatedEvent['data'],msg:Message){
        console.log('Event data',data);

        msg.ack();
    }


}