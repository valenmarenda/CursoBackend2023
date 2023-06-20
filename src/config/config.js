import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;
const TTL = process.env.TTL; 
const SECRET = process.env.SECRET;
export const config = {
    server: {
        port: PORT
    },
    mongo: {
        url: MONGO_URL,
        ttl: TTL,
        secret: SECRET
    },
}