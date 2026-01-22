import {jwtVerify, createRemoteJWKSet} from 'jose';
import dotenv from "dotenv";
dotenv.config()

let authUrl:string|undefined = process.env.SUPABASE_AUTH_URL;

if(authUrl === undefined){
     authUrl =""
}


const PROJECT_JWKS =createRemoteJWKSet(
    new URL(authUrl)
);



async function verifyProjectJwt(jwt: string){
    return  jwtVerify(jwt, PROJECT_JWKS);
   
}

export default verifyProjectJwt;