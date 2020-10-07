import { Subjects, Publisher, OrderCancelledEvent } from '@gazmer-ecomm2/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}