// we need to import all the necessary hooks and methods from react
import React, { createContext, useState, useRef, useEffect } from 'react';
// now we need to import io from socket.io-client
import { io } from 'socket.io-client';
// importing the Peer to Peer from simple peer
import Peer from 'simple-peer';
// we will create a variable calld Socketcontext
const SocketContext = createContext();

// now we will point our socket to our back provider
const socket = io('https://zinrack-chat-app.herokuapp.com/');
// here we will place all the children which the useEstate (hooks) to make the application functional
const ContextProvider = ({ children }) => {
  // in this use state we are checking if the call accepted
  const [callAccepted, setCallAccepted] = useState(false);
  // in this useEstate we are checking if the call ended
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [name, setName] = useState('');
  const [call, setCall] = useState({});
  const [me, setMe] = useState('');
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  // useEffect is used to mount certain events meaning when the page is loaded what do we want to happen. in this case we want the the browser to ask for
  // permissions to access the camera and and microphone and we will do that using Navigator and current stream
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);

        myVideo.current.srcObject = currentStream;
      });

    socket.on('me', (id) => setMe(id));
    // and then we set the call
    socket.on('callUser', ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });
  }, []);
  // this function is used to to answer the call, but will also connect this function with it's useEstate which we decleared above whihc will set it to true
  const answerCall = () => {
    // here we will set the useEstate which we decleared above to true
    setCallAccepted(true);
    // now we will start using the peer connection
    const peer = new Peer({ initiator: false, trickle: false, stream });
    // here we are listening to the data which is the signal
    peer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: call.from });
    });
    // now we will set the video for the other user
    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  // this function is used to make the call to the user. we have also passed the id as an argument which we delcread in the back-end file index.js
  const callUser = (id) => {
    // here we are using the same peer we used in the previous useEstate but we are setting this one to true
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on('signal', (data) => {
      // here we will be emiting callUser not callAnswer as the previous one
      // and we are going to change the parameters to the following
      socket.emit('callUser', { userToCall: id, signalData: data, from: me, name });
    });

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });
    // now we set the call to accepted
    socket.on('callAccepted', (signal) => {
      setCallAccepted(true);

      peer.signal(signal);
    });

    connectionRef.current = peer;
  };
  // this function will trun the useEstate setCallEnded to true which means it will turn off the call
  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current.destroy();

    window.location.reload();
  };

  return (
    <SocketContext.Provider value={{
      call,
      callAccepted,
      myVideo,
      userVideo,
      stream,
      name,
      setName,
      callEnded,
      me,
      callUser,
      leaveCall,
      answerCall,
    }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
