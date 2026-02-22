import {io} from 'socket.io-client';

// Use an explicit backend URL when configured; otherwise keep local dev default.
const URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const socket = io(URL);

export let pinsData = null;
socket.on('init', (data) => {
    pinsData = data;
});
