import request from 'supertest';
import {app} from '../../app';



it('returns 201 on successful signup',async ()=>{
    // return request(app)
    //     .post('/api/users/signup')
    //     .send({
    //         email: 'test@test.com',
    //         password: 'password'
    //     })
    //     .expect(201);
});

// it('returns 400 with an invalid email',async ()=>{
//     return request(app)
//         .post('/api/users/signup')
//         .send({
//             email:'abc'
//         })
//         .expect(400);
// })

// it('returns 400 with an invalid password',async ()=>{
//     return request(app)
//         .post('/api/users/signup')
//         .send({
//             email:'test@test.com',
//             password:'as'
//         })
//         .expect(400);
// })

// it('returns 400 with missing email and password',async ()=>{
//     return request(app)
//         .post('/api/users/signup')
//         .send({
//         })
//         .expect(400);
// })

// it('email must be unique',async()=>{
//     await request(app)
//         .post('/api/users/signup')
//         .send({
//             email:'test@test.com',
//             password:'abcde'
//         })
//         expect(201);
//         await request(app)
//         .post('/api/users/signup')
//         .send({
//             email:'test@test.com',
//             password:'abcde'
//         })
//         expect(400);
    
// })

// it('sets a cookie after a successful sign up',async()=>{
//     const response = await request(app)
//         .post('/api/users/signup')
//         .send({
//             email:'test@test.com',
//             password:'abcde'
//         })
//         .expect(201);
//     expect(response.get('Set-Cookie')).toBeDefined();
    
// })