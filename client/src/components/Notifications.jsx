import React, { useContext } from 'react';
import { Button } from '@material-ui/core';
// import functions from our sockets
import { SocketContext } from '../Context';
// we will create a useEstate that will check if the call is accepted or answered or call is made
const Notifications = () => {
  const { answerCall, call, callAccepted } = useContext(SocketContext);
  // if call is not accepted or call is made, if both are correct then it will show is calling
  return (
    <>
      {call.isReceivingCall && !callAccepted && (
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <h1>{call.name} is calling:</h1>
          <Button variant="contained" color="primary" onClick={answerCall}>
            Answer
          </Button>
        </div>
      )}
    </>
  );
};

export default Notifications;
