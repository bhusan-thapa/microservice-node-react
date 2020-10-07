import express,{Request,Response} from 'express';
import {body} from 'express-validator';
import {
    validateRequest,
    NotFoundError,
    requireAuth,
    NotAuthorizedError
} from '@gazmer-ecomm2/common';
import {Product} from '../models/product';
// import {clearCache} from '../services/cache';
import  {ProductUpdatedPublisher} from '../events/publishers/product-updated-publisher';
import {natsWrapper} from '../nats-wrapper';
const router = express.Router();

router.put('/api/products/:id',
requireAuth,
[
    body('title')
    .not()
    .isEmpty()
    .withMessage('Title is required'),
    body('price')
    .isFloat({gt: 0})
    .withMessage('Price should be greater than 0')
],
validateRequest,
async(req:Request,res:Response)=>{
    // clearCache(req.params.id);
    const product = await Product.findById(req.params.id);
    if(!product){
        throw new NotFoundError();
    }
    if(product.userId !== req.currentUser!.id){
        throw new NotAuthorizedError();
    }
    product.set({
        title: req.body.title,
        price:req.body.price
    });
    await product.save();
    // Publish event 
    new ProductUpdatedPublisher(natsWrapper.client).publish({
        id: product.id,
        title: product.title,
        price: product.price,
        userId: product.userId,
        version: product.version
    })
    res.send(product);

})

export {router as updateProductRouter}