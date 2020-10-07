import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import {app} from '../app';

declare global{
    namespace NodeJS{
        interface Global{
            // signin(): Promise<string[]>
            signin(id?:string): string[];
        }
    }
}
jest.mock('../nats-wrapper');
process.env.STRIPE_KEY ='sk_test_51HRD3PEBDVAIlBSpzXSVgtmGTfhreAgV3NRHG1pTUokQi3dhIxUpcHVeaxuLSRB4F4wkwqlqRe2svqX9BG5A2aOP00n2F1CnXC';
let mongo: any;
beforeAll(async ()=>{
    process.env.JWT_KEY='abcd';
    process.env.NODE_TLS_REJECT_UNAUTHORIZED ='0';
     mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();
    await mongoose.connect(mongoUri,{
        useNewUrlParser:true,
        useUnifiedTopology: true
    });
});


beforeEach(async()=>{
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();
    for(let collection of collections){
        await collection.deleteMany({});
    }
});

afterAll(async ()=>{
    await mongo.stop();
    await mongoose.connection.close();

})

global.signin = (id?:string)=>{
    // build a JWT for testing purpose

    const payload = {
        id: id || new mongoose.Types.ObjectId().toHexString(),
        email:'test@test.com'
    };
    const token = jwt.sign(payload,process.env.JWT_KEY!);
    const session = {jwt:token};
    const sessionJSON = JSON.stringify(session);
    const base64 = Buffer.from(sessionJSON).toString('base64');
    return [`express:sess=${base64}`];

}