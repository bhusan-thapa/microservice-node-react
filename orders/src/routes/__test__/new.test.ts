import request from 'supertest';
import mongoose from 'mongoose';
import {app} from '../../app';
import {Product} from '../../models/product';
import {natsWrapper} from '../../nats-wrapper';

it('returns error if the prduct doesnt exist',async ()=>{
    const productId = mongoose.Types.ObjectId();
    await request(app)
        .post('/api/orders')
        .set('Cookie',global.signin())
        .send({productId})
        .expect(404);
});

it('creates a successful order', async()=>{
    const product = Product.build({
        title: 'gun',
        price: 10,
        id: mongoose.Types.ObjectId().toHexString()
    });
    await product.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie',global.signin())
        .send({productId:product.id})
        .expect(201);
});

it('order created event is published',async()=>{
    const product = Product.build({
        title: 'gun',
        price: 10,
        id: mongoose.Types.ObjectId().toHexString()
    });
    await product.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie',global.signin())
        .send({productId:product.id})
        .expect(201);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});