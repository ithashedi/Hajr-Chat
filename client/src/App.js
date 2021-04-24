import React from 'react';

// importing two components from material UI
import { Typography, AppBar } from '@material-ui/core';
// this will help us to write css in material UI
import { makeStyles } from '@material-ui/core/styles';

import VideoPlayer from './components/VideoPlayer';
import Sidebar from './components/Sidebar';
import Notifications from './components/Notifications';

// we will use the makestyles hook
const useStyles = makeStyles((theme) => ({
  appBar: {
    borderRadius: 15,
    margin: '30px 100px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '600px',
    border: '2px solid black',

    [theme.breakpoints.down('xs')]: {
      width: '90%',
    },
  },
  image: {
    marginLeft: '15px',
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
}));

const App = () => {
  const classes = useStyles();

  return (
    // here we will be giving our css by giving the elements class which we already decleared above
    <div className={classes.wrapper}>
      <AppBar className={classes.appBar} position="static" color="inherit">
        <Typography variant="h2" align="center">Hajr Video Call</Typography>
      </AppBar>
      <VideoPlayer />
      <Sidebar>
        {/* we will place notifications inside sidebar and then we will use children to pass from the sidebar component */}
        <Notifications />
      </Sidebar>
    </div>
  );
};

export default App;
