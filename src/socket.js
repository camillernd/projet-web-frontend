import { io } from 'socket.io-client';

const socket = io('http://aftermovie.cluster-ig3.igpolytech.fr:5000', {
  path: '/ws'  // Specify the correct path if needed
});

export default socket;

