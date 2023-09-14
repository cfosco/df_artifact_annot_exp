import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Button, Typography } from '@material-ui/core';
import { Link } from "react-router-dom";
import video from "./subtitled_instruction_vid_exp2_cut.mp4";
import Gif1 from './instr_gif_1.gif';
import Gif2 from './instr_gif_2.gif';
import DoDont from './dodont.png';

const useStyles = makeStyles({
  root: {
    display: "flex",
    minHeight: "100vh",
    width: "100vw",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: 16,
  },
  topContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  demoVideoContainer: {
    marginBottom: 16,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  bottomContainer: {

  },
  startButton: {
    borderRadius: 16,
    fontSize: 36,
    width: 570,
    paddingLeft: 32,
    paddingRight: 32,
  },
  gifContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
});


export default function Landing(props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.topContainer}>
        <Typography variant="h2" style={{marginBottom: 16}}>
          Deep Fake Click
        </Typography>
        <Typography variant="subtitle1" align="center">
          <b>Instructions:</b>
          <br />
          Please watch the demo video below for an example of how this task should be completed. Please only <b>mark areas of the face</b> and <b>not</b> the background.
          <br />
          Each video is <b>3 seconds</b> long. There will be 10 videos per level for 11 levels.
          You must view the full 3 second long video at least once before continuing to the next video.
          <br />
          To navigate the video use the <b>left</b> arrow key to go 1 second backwards, <b>right</b> arrow key to go 1 second forwards
          , and <b>space bar</b> to play/pause the video. <br />
          <br />
          All of these videos are <b>fake, AI-generated</b> videos. Please <b>click and drag</b> on the <b>right</b> video to highlight areas that gave you an indication this video was fake.
          The video will automatically pause whenver you are highlighting an area, and you must press the space bar to resume the video.
          <br />
          The video on the <b>left</b> indicates areas on the video that you have marked, and the color of the marked area indicates the time when the area was marked (green = close to the beginning of the video, red = close to the end of the video). <br />
          You are allowed to watch the video any number of times and navigate to specific times in the video. <br />
          <br />
          Please avoid making just one click on a video or marking a singular point. <br/>
          Also avoid circling the defects: paint them over instead. You can increase the brush size if you want to paint a large area. See the image below for reference.
          <br />
          The GIFs and Demo Video below will help you perform better at the task. Please take some time to watch them!
          <br />
        </Typography>
        <div className={classes.gifContainer}>
          <img src={DoDont} width="80%" style={{marginRight: 16}} />
        </div>
        <br/>
        <br/>
        <br/>
        <div className={classes.gifContainer}>
          <img src={Gif1} width="40%" style={{marginRight: 16}} />
          <img src={Gif2} width="40%" style={{marginLeft: 16}} />
        </div>
      </div>
      <div className={classes.demoVideoContainer}>
        <Typography variant="h5" gutterBottom>
          Demo Video: How to Complete this Task
        </Typography>
        <video src={video} width={360} height={360} controls />
      </div>
      <div className={classes.bottomContainer}>
        <Link to={{pathname:"/interface", search: props.location.search}}>
          <Button variant="contained" size="large" className={classes.startButton}>
            Start
          </Button>
        </Link>
      </div>
    </div>
  );
}
