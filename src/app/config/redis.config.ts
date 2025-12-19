import { createClient } from 'redis';

import config from '.';
 
 export const redisClient = createClient({
    username: config.username,
    password: config.password,
    socket: {
        host: config.socket.host,
        port: Number(config.socket.port),
    }
});

redisClient.on('error', err => console.log('Redis Client Error', err));

 export const connectRedis = async  () =>{
    if(!redisClient.isOpen){
     await redisClient.connect();
     console.log(" Redis Connected");
     
    }
}