import request from 'supertest';
import {app} from '../../app';


it('fails if email doesnot exist',async()=>{
    await request(app)
        .post('/api/users/signin')
        .send({
            email:'test@test.com',
            password:'abcd'
        })
        .expect(400);
    
})

it('fails when password is not correct',async()=>{
    await request(app)
        .post('/api/users/signup')
        .send({
            email:'test@test.com',
            password:'abcd'
        })
        .expect(201);
    await request(app)
        .post('/api/users/signin')
        .send({
            email:'test@test.com',
            password:'123'
        })
        .expect(400);
})

it('responds with a cookie when given valid credentials',async()=>{
    await request(app)
        .post('/api/users/signup')
        .send({
            email:'test@test.com',
            password:'abcd'
        })
        .expect(201);
    const response = await request(app)
        .post('/api/users/signin')
        .send({
            email:'test@test.com',
            password:'abcd'
        })
        .expect(200);
    expect(response.get('Set-Cookie')).toBeDefined();
})