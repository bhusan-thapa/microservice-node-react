import express,{Request,Response} from 'express';
import {body, validationResult} from 'express-validator';
import jwt from 'jsonwebtoken';

import {Password} from '../utils/password';
import {User} from '../models/user';
import {validateRequest,BadRequestError} from '@gazmer-ecomm2/common';

const router = express.Router();

router.post('/api/users/signin',[
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Must provide the password')

],
validateRequest,
async (req:Request,res:Response)=>{
    const {email,password} = req.body;
    const existingUser = await User.findOne({email});
    if(!existingUser){
        throw new BadRequestError('Invalid credentials');
    }

    const passwordMatch = await Password.compare(existingUser.password,password);
    if(!passwordMatch){
        throw new BadRequestError('Invalid Credentials')
    }


    //Generate JWT
   
    const userJwt = jwt.sign({
        id: existingUser.id,
        email: existingUser.email
    },
    process.env.JWT_KEY!);
    //Store on session object
    req.session={
        jwt:userJwt
    };

    res.status(200).send(existingUser);

})


export {router as signinRouter}