import request from 'supertest';
import mongoose from 'mongoose';
import {app} from '../../app';
import {Product} from '../../models/product';


it('fetches the correct order',async()=>{
    const product = Product.build({
        title:'phone',
        price: 10,
        id: mongoose.Types.ObjectId().toHexString()
    });
    await product.save();

    const user = global.signin();

    const {body:order} = await request(app)
        .post('/api/orders')
        .set('Cookie',user)
        .send({productId: product.id})
        .expect(201);
    const {body:fetchedOrder} =await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie',user)
        .send({})
        .expect(200);
    expect(fetchedOrder.id).toEqual(order.id);
});

it('returns error if one user try to fecth another users order',async()=>{
    const product = Product.build({
        title:'phone',
        price: 10,
        id: mongoose.Types.ObjectId().toHexString()
    });
    await product.save();

    const user = global.signin();

    const {body:order} = await request(app)
        .post('/api/orders')
        .set('Cookie',user)
        .send({productId: product.id})
        .expect(201);
    await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie',global.signin())
        .send({})
        .expect(401);
})