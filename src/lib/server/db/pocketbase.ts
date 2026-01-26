import PocketBase from 'pocketbase';
//import { VITE_POCKETBASE_URL } from '$env/static/private'; // Define esto en .env
import { PB_LOCAL_IP } from '$env/static/private';

export function createPbServer() {
    return new PocketBase(PB_LOCAL_IP);
}