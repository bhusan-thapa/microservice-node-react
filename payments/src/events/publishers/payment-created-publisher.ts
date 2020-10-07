import { Publisher,PaymentCreatedEvent, Subjects} from '@gazmer-ecomm2/common';


export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    subject:Subjects.PaymentCreated = Subjects.PaymentCreated
}