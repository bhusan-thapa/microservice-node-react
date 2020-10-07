import request from 'supertest';
import mongoose from 'mongoose';
import {app} from '../../app';
import {natsWrapper} from '../../nats-wrapper';

it('returns 404 if the product is not found',async()=>{
    const id = mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/products/${id}`)
        .set('Cookie',global.signin())
        .send({
            title:'macbook',
            price:10
        })
        .expect(404); 
});

it('returns 401 if the user is not authenticated',async()=>{
    const id = mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/products/${id}`)
        .send({
            title:'macbook',
            price:10
        })
        .expect(401);

});

it('returns 401 if the user doesnt own the product',async()=>{
    const response = await request(app)
        .post('/api/products')
        .set('Cookie',global.signin())
        .send({
            title:'gun',
            price:5
        });
    await request(app)
        .put(`/api/products/${response.body.id}`)
        .set('Cookie',global.signin())
        .send({
            title:'bomb',
            price:10
        })
        .expect(401);

    
});

it('returns 400 if the user provides invalid title and price',async()=>{
    const cookie= global.signin();
    const response = await request(app)
        .post('/api/products')
        .set('Cookie',cookie)
        .send({
            title:'gun',
            price:5
        });
    await request(app)
        .put(`/api/products/${response.body.id}`)
        .set('Cookie',cookie)
        .send({
            title:'',
            price:19
        })
        .expect(400);

    await request(app)
        .put(`/api/products/${response.body.id}`)
        .set('Cookie',cookie)
        .send({
            title:'abcd',
            price:-9
        })
        .expect(400);
    
});

it('updates the product if the inputs are valid',async()=>{

    const cookie= global.signin();
    const response = await request(app)
        .post('/api/products')
        .set('Cookie',cookie)
        .send({
            title:'gun',
            price:5
        });
    
    await request(app)
        .put(`/api/products/${response.body.id}`)
        .set('Cookie',cookie)
        .send({
            title: 'gunz',
            price: 10
        })
        .expect(200);
    

    const productReponse = await request(app)
        .get(`/api/products/${response.body.id}`)
        .send();
    expect(productReponse.body.title).toEqual('gunz');
    expect(productReponse.body.price).toEqual(10);
});


it('publishes an event when a product is updated',async()=>{
    const cookie= global.signin();
    const response = await request(app)
        .post('/api/products')
        .set('Cookie',cookie)
        .send({
            title:'gun',
            price:5
        });
    
    await request(app)
        .put(`/api/products/${response.body.id}`)
        .set('Cookie',cookie)
        .send({
            title: 'gunz',
            price: 10
        })
        .expect(200);

        expect(natsWrapper.client.publish).toHaveBeenCalled();

})
