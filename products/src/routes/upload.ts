import express,{Request,Response} from 'express';
import  AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import {requireAuth} from '@gazmer-ecomm2/common';

const router = express.Router();
const s3 = new AWS.S3({
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.AWS_SECRET,
    signatureVersion:'v4',
    region:'us-east-2'
});
router.get('/api/upload',requireAuth,async(req:Request,res:Response)=>{
    const key =`${req.currentUser!.id}/${uuidv4()}.jpeg`;
    s3.getSignedUrl('putObject',{
        Bucket:'ecomm2-dev',
        ContentType: 'image/jpeg',
        Key: key
    },(err,url)=>{
        res.send({key,url});
    })
})


export {router as uploadProduct};