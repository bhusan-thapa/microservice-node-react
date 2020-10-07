import express, {Request, Response} from 'express';
import {body} from 'express-validator';
import {validateRequest,requireAuth,BadRequestError,NotFoundError} from '@gazmer-ecomm2/common';
import {Product} from '../models/product';

const router = express.Router();

router.put('/api/products/reply/:id/:qid',requireAuth,
[
    body('reply')
        .not()
        .isEmpty()
        .withMessage('Answer cant be empty')
],
validateRequest,
async (req:Request,res:Response)=>{
     const product = await Product.findById(req.params.id);
     if(!product){
         throw new NotFoundError();
     }
     if(product.userId !== req.currentUser!.id){
         throw new BadRequestError('Only the product owner can submit answer');
     }
     try{
        await Product.updateOne(
            {'questions._id':req.params.qid},
            {'$set':{
                'questions.$.answer':req.body.reply
            }}
        )
     }catch(err){
        throw new BadRequestError('No question found')
     }  
    res.send(product);
}
)

export {router as addAnswerRouter};