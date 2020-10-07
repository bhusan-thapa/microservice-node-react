import express,{Request,Response} from 'express';

import {currentUser,requireAuth,requireMerchant} from '@gazmer-ecomm2/common';

const router = express.Router();

router.get('/api/users/test',
currentUser,
requireAuth,
requireMerchant,
(req,res)=>{
    res.send('Just a test');
})


export {router as testRouter}