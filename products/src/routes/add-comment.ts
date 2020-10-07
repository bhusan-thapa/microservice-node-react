import express, {Request,Response} from 'express';
import {body} from 'express-validator';
import {Product} from '../models/product';
import {requireAuth,validateRequest,NotFoundError,BadRequestError} from '@gazmer-ecomm2/common';
const router = express.Router();

router.put('/api/products/add-comment/:id',requireAuth,
[
    body('rating')
    .not()
    .isEmpty()
    .isInt({min:1, max:5})
    .withMessage('Rating must be between 1-5')
],
validateRequest,
async(req:Request,res:Response)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
        throw new NotFoundError();
    }
    if(product.userId === req.currentUser!.id){
        throw new BadRequestError('Owner cant write reviews')
    }
    const {rating, comments} = req.body;
    product.commentRating!.push({
        rating,
        comments,
        userId: req.currentUser!.id
    });
    await product.save();
    
    res.send(product);
}
)

export {router as addCommentRouter}