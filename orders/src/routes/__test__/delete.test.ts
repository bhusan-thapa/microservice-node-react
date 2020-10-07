import request from 'supertest';
import mongoose from 'mongoose';
import {app} from '../../app';
import {Product} from '../../models/product';
import {Order,OrderStatus} from '../../models/order';
import {natsWrapper} from '../../nats-wrapper';

it('marks an order as cancelled', async()=>{

    const product = Product.build({
        title: 'gun',
        price: 10,
        id: mongoose.Types.ObjectId().toHexString()
    });
    await product.save();
    const user = global.signin();
    const {body:order} =await request(app)
        .post('/api/orders')
        .set('Cookie',user)
        .send({productId: product.id})
        .expect(201);

    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie',user)
        .send()
        .expect(204);
    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
    
});

it('emits event when the order is cancelled',async()=>{
    const product = Product.build({
        title: 'gun',
        price: 10,
        id: mongoose.Types.ObjectId().toHexString()
    });
    await product.save();
    const user = global.signin();
    const {body:order} =await request(app)
        .post('/api/orders')
        .set('Cookie',user)
        .send({productId: product.id})
        .expect(201);

    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie',user)
        .send()
        .expect(204);
    expect(natsWrapper.client.publish).toHaveBeenCalled();

});