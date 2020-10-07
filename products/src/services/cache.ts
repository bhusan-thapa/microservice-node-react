import redis from 'redis';
import {promisify} from 'util';


const redisUrl = 'redis://redis-cache-srv:6379';
const client = redis.createClient(redisUrl);
const getAsync = promisify(client.get).bind(client);

export const getCache = async (query:string) =>{
 const products = await getAsync(query);
 return products;
}

export const setCache = async(query:string,value:string)=>{
    client.set(query,value,'EX',10);
}


export const clearCache = async(query:string)=>{
    client.del(query);
}