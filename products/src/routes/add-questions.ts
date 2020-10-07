import express, {Request,Response} from 'express';
import {body} from 'express-validator';
import {Product} from '../models/product';
import {requireAuth,validateRequest,NotFoundError,BadRequestError} from '@gazmer-ecomm2/common';


const router = express.Router();

router.put('/api/products/question/:id',requireAuth,
[
    body('question')
     .not()
     .isEmpty()
     .withMessage('Question cant be empty')
],
validateRequest,
async (req:Request,res:Response)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
        throw new NotFoundError();
    }
    if(product.userId === req.currentUser!.id){
        throw new BadRequestError('Owner can only reply!!')
    }
    const {question} = req.body;
    product.questions?.push({
        question,
        userId: req.currentUser!.id
    });
    await product.save();
    res.send(product);
}
)

export {router as addQuestionRouter};