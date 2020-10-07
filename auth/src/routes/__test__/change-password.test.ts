import request from 'supertest';
import {app} from '../../app';
import express,{Request,Response} from 'express';
import { currentUser,BadRequestError} from '@gazmer-ecomm2/common';
import {User} from '../../models/user';
import {Password} from '../../utils/password';

it('requires authentication',async()=>{
    await request(app)
        .post('/api/users/change-password')
        .send({})
        .expect(401);  

})

    