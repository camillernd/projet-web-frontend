import { io } from 'socket.io-client';

const socket = io('http://aftermovie-backend.cluster-ig3.igpolytech.fr:5000');

export default socket;
