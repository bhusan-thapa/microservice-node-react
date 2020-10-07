import express, {Request,Response} from 'express';
import  {body,validationResult} from 'express-validator';
import jwt from 'jsonwebtoken';

import {validateRequest,BadRequestError} from '@gazmer-ecomm2/common';
import {Merchant} from '../models/merchant';
// import {Mailer} from '../utils/Mailer';

const router = express.Router();

router.post('/api/merchant/signup',[
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .isLength({min:4, max: 20})
        .withMessage('Password require at least 4 letters')
],
validateRequest,
async (req:Request,res:Response)=>{
    // const errors = validationResult(req);
    // if(!errors.isEmpty()){
    //     throw new RequestValidationError(errors.array())
    // }
    const {email,password} = req.body;
    const existingUser = await Merchant.findOne({email});
    if(existingUser){
        throw new BadRequestError('Email already in use')
    }
    const user = Merchant.build({email,password,role:'merchant'});
    await user.save();
    //Generate JWT
   
    const userJwt = jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role
    },
    process.env.JWT_KEY!);
    //Store on session object
    req.session={
        jwt:userJwt
    };

    res.status(201).send(user);
})


export {router as merchantSignupRouter}