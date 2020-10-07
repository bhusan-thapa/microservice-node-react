import request from 'supertest';
import  {app} from '../../app';
import {Product} from '../../models/product';
import {natsWrapper} from '../../nats-wrapper';

it('has a route handler listening to /api/products for post request',async()=>{
    const response = await request(app) 
                        .post('/api/products')
                        .send({});
    expect(response.status).not.toEqual(404);


});

it('can be accesed by only authenticated user',async()=>{
     await request(app)
           .post('/api/products')
           .send({})
           .expect(401);
});

it('doesnt return 401 if the user is signed in',async()=>{
    const response = await request(app) 
                        .post('/api/products')
                        .set('Cookie',global.signin())
                        .send({});
    expect(response.status).not.toEqual(401);


})

it('returns error if invalid title is provided',async()=>{
     await request(app)
        .post('/api/products')
        .set('Cookie',global.signin())
        .send({
            title:'',
            price:10
        })
        .expect(400);
        await request(app)
        .post('/api/products')
        .set('Cookie',global.signin())
        .send({
            price:10
        })
        .expect(400);
});


it('returns error if invalid price is provided',async()=>{
    await request(app)
    .post('/api/products')
    .set('Cookie',global.signin())
    .send({
        title:'Iphone',
        price:-10
    })
    .expect(400);
    await request(app)
    .post('/api/products')
    .set('Cookie',global.signin())
    .send({
        title:'Iphone'
    })
    .expect(400);
});

it('creates Product with valid title and price',async()=>{
    const title = 'iphone';
    let products = await Product.find({});
    expect(products.length).toEqual(0);


    await request(app)
        .post('/api/products')
        .set('Cookie',global.signin())
        .send({
            title,
            price: 10
        })
        .expect(201);

   products = await Product.find({});
   expect(products.length).toEqual(1);
   expect(products[0].title).toEqual(title);
   expect(products[0].price).toEqual(10);


})

it('publishes an event',async()=>{
    const title = 'iphone';
    await request(app)
        .post('/api/products')
        .set('Cookie',global.signin())
        .send({
            title,
            price: 10
        })
        .expect(201);
        expect(natsWrapper.client.publish).toHaveBeenCalled();

})