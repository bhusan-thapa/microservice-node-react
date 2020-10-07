import {Publisher,Subjects,ProductCreatedEvent} from '@gazmer-ecomm2/common';

export class ProductCreatedPublisher extends Publisher<ProductCreatedEvent>{
    readonly subject= Subjects.ProductCreated;
}