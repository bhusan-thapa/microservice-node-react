import {Message} from 'node-nats-streaming';
import {ProductUpdatedEvent} from '@gazmer-ecomm2/common';
import mongoose from 'mongoose';
import {ProductUpdatedListener} from '../product-updated-listener';
import {natsWrapper } from '../../../nats-wrapper';
import {Product} from '../../../models/product';




const setup = async ()=>{
    const listener = new ProductUpdatedListener(natsWrapper.client);
    const product = Product.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'gun',
        price: 10     
    });
    await product.save();

    const data: ProductUpdatedEvent['data'] = {
        version: product.version +1 ,
        id: product.id,
        title: 'bomb',
        price: 15,
        userId: mongoose.Types.ObjectId().toHexString()
    };

 // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };
  return {listener,data,msg,product};
};

it('finds, updates and saves a product',async()=>{
    const {msg, data, listener,product} = await setup();
    await listener.onMessage(data,msg);

    const updatedProduct = await Product.findById(product.id);
    expect(updatedProduct!.title).toEqual(data.title);
    expect(updatedProduct!.price).toEqual(data.price);
    expect(updatedProduct!.version).toEqual(data.version);
});

it('acks the message',async()=>{
    const {data,listener,msg} = await setup();
    await listener.onMessage(data,msg);
    expect(msg.ack).toHaveBeenCalled();
});


