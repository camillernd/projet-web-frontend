// socket.js
import { io } from 'socket.io-client';

const socket = io('http://aftermovie-backend.cluster-ig3.igpolytech.fr');

export default socket;
