import {io, Socket} from 'socket.io-client';
import {Server} from '../../config/server';
import {useEffect} from 'react';
import { useAuth } from '../useAuth';

const Sockets = new Map<string, Socket>();
  const {user} = useAuth()
  console.log('Socket Auth',user)


// const {user} = useAuth();
export const connectSocket =
  (SocketName = 'default') =>
  (query: {}, user_id: any) => {
    if (!Sockets.has('default')) {
      const newSocket = io('https://api.constructified.com?token='+user_id, {
        transports: ['websocket'],
        autoConnect: true,
        reconnection: true,
        reconnectionDelay: 500,
        reconnectionAttempts: 100,
        query,
      });
      Sockets.set(SocketName, newSocket);
      listenSocket({
        connect: () => {
          console.log('Connected');
        },
        connect_error: () => {
          console.log('Error Connected');
        },
      });

      newSocket.connect();
      console.log('_joinSocketCb Connected /*********');
     
      console.log({Sockets});
    }
  };
const listenSocketBase =
  (SocketName = 'default') =>
  (listeners = {}) => {
    if (Sockets.has(SocketName)) {
      Object.entries(listeners).map(([k, v]) => {
        // console.log(listeners, ' lis ====', k, v);
        Sockets.get(SocketName)?.on(k, v);
      });
      return () => {
        Object.entries(listeners).map(([k, v]) => {
          Sockets.get(SocketName)?.removeListener(k, v);
        });
      };
    } else {
      console.error('Socket Not Initiated');
      // throw new Error('Socket Not Initiated');
    }
  };
const useSocketBase =
  (SocketName = 'default') =>
  (listeners = {}) => {
    useEffect(() => listenSocketBase(SocketName)(listeners), [listeners]);
    return (...args: any) => {
      console.log(SocketName, args);
      if (args[0] == 'disconnect') {
        Sockets.get(SocketName)?.disconnect();
        Sockets.delete(SocketName);
        return;
      }
      Sockets.get(SocketName)?.emit(...args, listeners[args[0]]);
    };
  };
export const removeSocketInstance =
  (SocketName = 'default') =>
  () => {
    Sockets.get(SocketName)?.removeAllListeners?.();
    Sockets.delete(SocketName);
  };

export const listenSocket = listenSocketBase();
export const useSocket = useSocketBase();
