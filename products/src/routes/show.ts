import express,{Request,Response} from 'express';
import {NotFoundError} from '@gazmer-ecomm2/common';

import {Product} from '../models/product';
// import {getCache,setCache} from '../services/cache';

const router = express.Router();

router.get('/api/products/:id',async(req:Request,res:Response)=>{

    // const cachedProduct = await getCache(req.params.id);
    // if(cachedProduct){
    //     console.log('from cache');
    //     return res.send(JSON.parse(cachedProduct));
    // }
    const product = await Product.findById(req.params.id);
    if(!product){
        return new NotFoundError();
    }
    // console.log('from mongo');
    // setCache(req.params.id,JSON.stringify(product));
    res.send(product);
})


export {router as showProductRouter};