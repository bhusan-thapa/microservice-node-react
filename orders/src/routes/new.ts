import mongoose from 'mongoose';
import express, {Request,Response} from 'express';
import {body} from 'express-validator';
import {requireAuth,validateRequest,NotFoundError} from '@gazmer-ecomm2/common';
import {Order,OrderStatus} from '../models/order';
import {Product} from '../models/product';
import {natsWrapper} from '../nats-wrapper';
import {OrderCreatedPublisher} from '../events/publishers/order-created-publisher';
const router = express.Router();

router.post('/api/orders',
requireAuth,
[
    body('productId')
     .not()
     .isEmpty()
     .custom((input:string)=>mongoose.Types.ObjectId.isValid(input))
     .withMessage('Product ID must be provided')
],
validateRequest,
async(req:Request,res:Response)=>{
    const {productId} = req.body;
    const product = await Product.findById(productId);
    if(!product){
        throw new NotFoundError();
    }
    const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        product
    });
    await order.save();

    // publish event
    new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order.id,
        userId: order.userId,
        version: order.version,
        product:{
            id: product.id,
            price: product.price
        },
        status: order.status
    });


    res.status(201).send(order);
})

export {router as newOrderRouter}