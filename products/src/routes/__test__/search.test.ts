import request from 'supertest';
import {app} from '../../app';
import {Product} from '../../models/product';


const createProduct = (product_title:string,product_price:number)=>{
    return request(app)
        .post('/api/products')
        .set('Cookie',global.signin())
        .send({
            title:product_title,
            price:product_price
        });

};
it(' search the list of products',async()=>{
    await createProduct("ball",2000);
    await createProduct("banana",350);
    await createProduct("apple",300);
    
    const response = await request(app)
        .get('/api/products?name=ba')
        .send({})
        .expect(200);
    
    expect(response.body.length).toEqual(2);
    
    
})
it(' list all the existing product if request query is empty',async()=>{
    await createProduct("ball",2000);
    await createProduct("banana",350);
    await createProduct("apple",300);
    
    const response = await request(app)
        .get('/api/products?')
        .send({})
        .expect(200);
    
    expect(response.body.length).toEqual(3);
    
})
it('all product title should contain all query parameter',async()=>{
    await createProduct("ball",2000);
    await createProduct("banana",350);
    await createProduct("apple",300);
    let products = await Product.find({});
    
    const response = await request(app)
        .get('/api/products?name=ba')
        .send({})
        .expect(200);
    
    expect(response.body[0].title.includes("ba")).toEqual(true);
    expect(response.body[1].title.indexOf("ba")).not.toEqual(-1);
    
    
    
    
    
})
