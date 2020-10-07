import request from 'supertest';
import mongoose from 'mongoose';
import {app} from '../../app';
import {Order} from '../../models/order';
import {Product} from '../../models/product';

const buildProduct = async()=>{
    const product =  Product.build({
        title: 'laptop',
        price: 100,
        id: mongoose.Types.ObjectId().toHexString()
    });
    await product.save();
    return product;
};


it('fetches order list of the given user', async()=>{
    const productOne = await buildProduct();
    const productTwo = await buildProduct();
    const productThree = await buildProduct();

    const userOne = global.signin();
    const userTwo = global.signin();

    await request(app)
        .post('/api/orders')
        .set('Cookie',userOne)
        .send({productId: productOne.id})
        .expect(201);
    const {body:orderOne}= await request(app)
        .post('/api/orders')
        .set('Cookie',userTwo)
        .send({productId: productTwo.id})
        .expect(201);
    const {body:orderTwo}= await request(app)
        .post('/api/orders')
        .set('Cookie',userTwo)
        .send({productId: productThree.id})
        .expect(201);

    const response =await request(app)
        .get('/api/orders')
        .set('Cookie',userTwo)
        .expect(200);
    
    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(orderOne.id);
    expect(response.body[1].id).toEqual(orderTwo.id);
});