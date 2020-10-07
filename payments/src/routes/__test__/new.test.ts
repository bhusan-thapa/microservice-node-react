import mongoose from 'mongoose';
import request from 'supertest';
import {OrderStatus} from '@gazmer-ecomm2/common';
import {app} from '../../app';
import {Order} from '../../models/order';
import {Payment} from '../../models/payment';

import {stripe} from '../../stripe';


it('returns a 404 when purchasing an order that doesnt exits',async()=>{
    await request(app)
        .post('/api/payaments')
        .set('Cookie',global.signin())
        .send({
            token: 'abcd',
            orderId: mongoose.Types.ObjectId().toHexString()
        })
        .expect(404);

});

it('returns a 401 when purchasing an order that doesnt belong to the user',async()=>{
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 10,
        status: OrderStatus.Created
    });
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie',global.signin())
        .send({
            token: 'abcd',
            orderId: order.id
        })
        .expect(401);

});

it('returns a 400 when purchasing an order that has been cancelled',async()=>{
    const userId = mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId,
        version: 0,
        price: 10,
        status: OrderStatus.Cancelled
    });
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie',global.signin(userId))
        .send({
            token: 'abcd',
            orderId: order.id
        })
        .expect(400);

});

it('returns 201 with valid inputs',async()=>{
    const userId = mongoose.Types.ObjectId().toHexString();
    const price = Math.floor(Math.random() * 100000);
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId,
        version: 0,
        price,
        status: OrderStatus.Created
    });
    await order.save();
    await request(app)
        .post('/api/payments')
        .set('Cookie',global.signin(userId))
        .send({
            token: 'tok_visa',
            orderId: order.id
        })
        .expect(201);


    const stripeCharges = await stripe.charges.list({limit: 50});
    const stripeCharge = stripeCharges.data.find(charge=>{
        return charge.amount === price * 100;
    });

    expect(stripeCharge).toBeDefined();
    expect(stripeCharge!.currency).toEqual('usd');
});