import React, { useContext } from 'react';
// importing all the elements we need from material UI
import { Grid, Typography, Paper, makeStyles } from '@material-ui/core';
// now we will import the socketcontaxt
import { SocketContext } from '../Context';
//
const useStyles = makeStyles((theme) => ({
  video: {
    width: '550px',
    [theme.breakpoints.down('xs')]: {
      width: '300px',
    },
  },
  gridContainer: {
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  paper: {
    padding: '10px',
    border: '2px solid black',
    margin: '10px',
  },
}));
// here we will be getting the data from our context file that contain all the data we need to run the video
const VideoPlayer = () => {
  const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } = useContext(SocketContext);
  const classes = useStyles();

  // here will change this to grid
  // here we will have two parts one is is the caller video and the other is the user video
  return (

    <Grid container className={classes.gridContainer}>
      {/* the caller stream or the the caller video */}
      {stream && (
        <Paper className={classes.paper}>
          <Grid item xs={12} md={6}>
            {/* the caller name */}
            <Typography variant="h5" gutterBottom>{name || 'Name'}</Typography>
            {/* we will set this to autoPlay to allow the video start when the call start */}
            <video playsInline muted ref={myVideo} autoPlay className={classes.video} />
          </Grid>
        </Paper>
      )}
      {callAccepted && !callEnded && (
        // the user video call
        <Paper className={classes.paper}>
          <Grid item xs={12} md={6}>
            {/* here we will have the name of the user at the bottom */}
            <Typography variant="h5" gutterBottom>{call.name || 'Name'}</Typography>
            {/* we will set this to autoPlay to allow the video start when the call start */}
            <video playsInline ref={userVideo} autoPlay className={classes.video} />
          </Grid>
        </Paper>
      )}
    </Grid>
  );
};

export default VideoPlayer;
