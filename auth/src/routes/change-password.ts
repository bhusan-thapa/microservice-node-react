import express,{Request,Response} from 'express';
import {body} from 'express-validator';

import {Password} from '../utils/password';
import {User} from '../models/user';
import {validateRequest,requireAuth,currentUser, BadRequestError} from '@gazmer-ecomm2/common';

const router = express.Router();

router.post('/api/users/change-password',currentUser,requireAuth,[
    body('old_password')
    .trim()
    .isLength({min:4,max:20})
    .withMessage('Password require atleast 4 characters'),

    body('new_password')
    .trim()
    .isLength({min:4,max:20})
    .withMessage('Passwor require atleast 4 characters')
],validateRequest,async(req:Request,res:Response)=>{
   
    const {new_password,old_password} = req.body;
    if(req.currentUser){
        const existingUser = await User.findById(req.currentUser.id);
        if(!existingUser){
            throw new BadRequestError('Cant find the user associated');
        }
        const passwordMatch = await Password.compare(existingUser.password,old_password);
        if(!passwordMatch){
            throw new BadRequestError('Old password is not correct');
        }
        const password = await Password.toHash(new_password);
        try{
            await User.updateOne({_id:existingUser.id},{password});
            res.status(200).send({sucess:true});
        }catch(err){
            throw new BadRequestError('Cant change the password');

        }   

    }else{
        throw new BadRequestError('Cant find the user associated');
    }

})


export {router as changePasswordRouter};
