import {Subjects,Publisher,OrderCreatedEvent} from '@gazmer-ecomm2/common';


export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
  }