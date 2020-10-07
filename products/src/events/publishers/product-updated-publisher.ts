import {Publisher,Subjects,ProductUpdatedEvent} from '@gazmer-ecomm2/common';

export class ProductUpdatedPublisher extends Publisher<ProductUpdatedEvent>{
    readonly subject= Subjects.ProductUpdated;
}