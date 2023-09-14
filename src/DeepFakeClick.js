import React, { Component } from 'react';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Button, Popover, Typography } from '@material-ui/core';
import videoData from './new_exp2_5levels_id0.json';
import $ from 'jquery';
import { Progress } from 'react-sweet-progress';
import Slider from 'rc-slider';
import Tooltip from 'rc-tooltip';
import 'rc-slider/assets/index.css';
import "react-sweet-progress/lib/style.css";
import DoDont from './dodont.png';

const MTURK_SUBMIT_SUFFIX = "/mturk/externalSubmit";

const Handle = Slider.Handle;
const handle = (props) => {
  const { value, dragging, index, ...restProps } = props;
  return (
    <Tooltip
      prefixCls="rc-slider-tooltip"
      overlay={value}
      visible={dragging}
      placement="top"
      key={index}
    >
      <Handle value={value} {...restProps} />
    </Tooltip>
  );
};

const styles = theme => ({
  root: {
    display: 'flex',
    width: '100vw',
    minHeight: '100vh',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'column',
  },
  irb: {
    width: "70%",
    textAlign: "center",
    padding: 16,
  },
  topSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  startButton: {
    borderRadius: 16,
    fontSize: 36,
    margin: 8,
  },
  levelProgress: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  progressSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  subVideoSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoSection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    margin: 16,
  },
  gifContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
});

const THEME = createMuiTheme({
  typography: {
   "fontFamily": "'Raleway', sans-serif",
   "fontSize": 14,
   "fontWeightLight": 100,
   "fontWeightRegular": 100,
   "fontWeightMedium": 100
  }
});

const maxVideoDuration = 3;

class DeepFakeClick extends Component {
  constructor(props){
    super(props);
    this.state = {
      anchorEl: null,
      brushSize: 12,
      buttonText: "NEXT LEVEL",
      coordinateData: [],
      currentLevel: 0,
      currentIndex: 0,
      data: {},
      disabled: true,
      fullPlay: false,
      maxLevels: Object.keys(videoData).length,
      maxVideos: videoData[0].length,
      mousedownStart: [],
      pause: false,
      percent: 0,
      seen: {},
      timer: Date.now(),
      videoData: videoData,
    };

    this.canvasRef = React.createRef();
    this.videoRef = React.createRef();

    this._handleClick = this._handleClick.bind(this);
    this._handleClose = this._handleClose.bind(this);
    this._handlePlayButton = this._handlePlayButton.bind(this);
    this._handleNextButton = this._handleNextButton.bind(this);
    this._handleSubmitButton = this._handleSubmitButton.bind(this);
    this._loadNextVideo = this._loadNextVideo.bind(this);
    this._submitHITform = this._submitHITform.bind(this);
  }

  componentDidMount() {
    document.getElementById('instruction-button').click();
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext("2d");
    const vid = this.videoRef.current;
    var i;
    var colors = []
    vid.onloadedmetadata = () => {
      colors = this._generateColors([0, 255, 0], [255, 0, 0], Math.round(vid.duration));
    }
    vid.onloadeddata = () => {
      if (this.state.coordinateData.length === 0) {
        i = window.setInterval(() => {
          if (vid.currentTime > maxVideoDuration) {
            vid.currentTime = 0;
          }
          if (Math.round(vid.currentTime) === maxVideoDuration) {
            this.setState({fullPlay: true});
          }
          if (vid.duration) {
            ctx.drawImage(vid, 0, 0, 360, 360)
            const scale2 = 360/540;
            for (let j = 0; j < this.state.coordinateData.length; j++) {
              var [x1, y1, time, brushSize] = this.state.coordinateData[j];
              var [r, g, b] = colors[Math.round(time)];
              ctx.beginPath();
              ctx.arc(x1*scale2, y1*scale2, brushSize, 0, 2 * Math.PI, false);
              ctx.fillStyle="rgb(" + r + ", " + g + ", " + b + ", 0.6)";
              ctx.fill();
            }
          }
        }, 20)
      }
    }
    vid.addEventListener('click', () => {
      clearInterval(this.interval);
      i = window.setInterval(() => {
        if (vid.duration) {
          ctx.drawImage(vid, 0, 0, 360, 360)
          const scale2 = 360/540;
          for (let j = 0; j < this.state.coordinateData.length; j++) {
            var [x1, y1, time, brushSize] = this.state.coordinateData[j];
            var [r, g, b] = colors[Math.round(time)];
            ctx.beginPath();
            ctx.arc(x1*scale2, y1*scale2, brushSize, 0, 2 * Math.PI, false);
            ctx.fillStyle="rgb(" + r + ", " + g + ", " + b + ", 0.6)";
            ctx.fill();
          }
        }
      }, 20)
    }, false);


    vid.addEventListener("mousedown", (e) => {
      clearInterval(this.interval);
      vid.pause();
      this.setState({pause: true});
      if (!this.state.seen[[e.offsetX, e.offsetY, vid.currentTime]]) {
        this.state.coordinateData.push([e.offsetX, e.offsetY, vid.currentTime, this.state.brushSize]);
        this.state.seen[[e.offsetX, e.offsetY, vid.currentTime]] = true;
      }
      vid.onmousemove = (e2) => {
        setTimeout(() => {
          if (!this.state.seen[[e2.offsetX, e2.offsetY, vid.currentTime]]) {
            this.state.coordinateData.push([e2.offsetX, e2.offsetY, vid.currentTime, this.state.brushSize]);
            this.state.seen[[e2.offsetX, e2.offsetY, vid.currentTime]] = true;
          }
          ctx.drawImage(vid, 0, 0, 360, 360)
          const scale2 = 360/540;
          for (let j = 0; j < this.state.coordinateData.length; j++) {
            var [x1, y1, time, brushSize] = this.state.coordinateData[j];
            var [r, g, b] = colors[Math.round(time)];
            ctx.beginPath();
            ctx.arc(x1*scale2, y1*scale2, brushSize, 0, 2 * Math.PI, false);
            ctx.fillStyle="rgb(" + r + ", " + g + ", " + b + ", 0.6)";
            ctx.fill();
          }
        });
      }
      vid.onmouseleave = () => {
        vid.onmousemove = null;
      }
    }, false);

    vid.addEventListener("mouseup", (e) => {
      vid.onmousemove = null;
    }, false);

    // arrowkey controls

    document.addEventListener("keydown", (event) => {
      switch(event.keyCode) {
        case 32: // space bar
          event.preventDefault();
          if (vid.paused) {
            this.setState({pause: false});
            vid.play();
          } else {
            this.setState({pause: true});
            vid.pause();
          }
          break;
        case 37: // left key
          event.preventDefault();
          var vid_time = vid.currentTime;
          vid.currentTime = vid_time - 1;
          break;
        case 39: // right key
          event.preventDefault();
          var  vid_time = vid.currentTime;
          vid.currentTime = vid_time + 1;
          break;
        default:
          break;
      }
    });

    vid.addEventListener('play', () => {
      i = window.setInterval(() => {
        if (vid.duration) {
          ctx.drawImage(vid, 0, 0, 360, 360)
          const scale2 = 360/540;
          for (let j = 0; j < this.state.coordinateData.length; j++) {
            var [x1, y1, time, brushSize] = this.state.coordinateData[j];
            var [r, g, b] = colors[Math.round(time)];
            ctx.beginPath();
            ctx.arc(x1*scale2, y1*scale2, brushSize, 0, 2 * Math.PI, false);
            ctx.fillStyle="rgb(" + r + ", " + g + ", " + b + ", 0.6)";
            ctx.fill();
          }
        }
      }, 20)
    }, false);
    vid.addEventListener('pause', () => {
      window.clearInterval(i);
    }, false);

    vid.addEventListener('ended', () => {
      clearInterval(i);
    }, false);

    var url = window.location.href;
    var identifier = "data";
    if (url.indexOf(identifier) > 0) {
      var file = this._gup(identifier);
      var data = require('./' + file + '.json');
      this.setState({videoData: data}, () => this.setState({
        maxLevels: Object.keys(this.state.videoData).length,
        maxVideos: this.state.videoData[0].length,
        percent: Math.round(Math.min((0) / this.state.videoData[0].length * 100, 100)),
      }))
    }
  }

  componentDidUpdate(){}


  _handleClick(e) {
    this.setState({anchorEl: e.currentTarget});
  }

  _handleClose() {
    this.setState({anchorEl: null});
  }


  _generateColors(start, end, n) {

    var steps = [
      (end[0] - start[0]) / n,
      (end[1] - start[1]) / n,
      (end[2] - start[2]) / n
    ];

    var colors = [start];
    for(var ii = 0; ii < n - 1; ++ii) {
      colors.push([
        Math.floor(colors[ii][0] + steps[0]),
        Math.floor(colors[ii][1] + steps[1]),
        Math.floor(colors[ii][2] + steps[2])
      ]);
    }
    colors.push(end);

    return colors;
  };

  _handleNextButton() {
    if (this.state.coordinateData.length === 0) {
      alert("You have not marked the video yet. Please do so before continuing");
      return;
    } else if (this.state.coordinateData.length < 10) {
      alert("The video was not properly marked. Please perform the task properly.");
      return;
    }
    clearInterval(this.interval);
    this.setState({
      percent: this.state.percent + 100/this.state.maxVideos,
    }, () => this._loadNextVideo());
  }

  _handleSubmitButton() {
    clearInterval(this.interval);

    if (this.state.buttonText === "NEXT LEVEL") {
      this._loadNextLevel();
    } else if (this.state.buttonText === "SUBMIT") {
      this._submitHITform();
    }
  }

  _submitHITform() {
    this.setState({disabled: true, overclick: true});
    var submitUrl = decodeURIComponent(this._gup("turkSubmitTo")) + MTURK_SUBMIT_SUFFIX;
    var form = $("#submit-form");

    console.log("Gup output for assignmentId, workerId:", this._gup("assignmentId"),this._gup("workerId"))
    this._addHiddenField(form, 'assignmentId', this._gup("assignmentId"));
    this._addHiddenField(form, 'workerId', this._gup("workerId"));
    this._addHiddenField(form, 'taskTime', (Date.now() - this.state.timer)/1000);
    this._addHiddenField(form, 'feedback', $("#feedback-input").val());

    var results = {
        'outputs': this.state.data,
    };
    this._addHiddenField(form, 'results', JSON.stringify(results));
    $("#submit-form").attr("action", submitUrl);
    $("#submit-form").attr("method", "POST");
    $("#submit-form").submit();
  }

  _gup(name) {
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var tmpURL = window.location.href;
    var results = regex.exec(tmpURL);
    if (results == null) return "";
    else return results[1];
  }

  _addHiddenField(form, name, value) {
    // form is a jQuery object, name and value are strings
    var input = $("<input type='hidden' name='" + name + "' value=''>");
    input.val(value);
    form.append(input);
  }

  _loadNextVideo() {
    this.setState({fullPlay: false});
    var key = this.state.currentLevel + "-" + this.state.currentIndex;
    var videoUrl = this.state.videoData[this.state.currentLevel][this.state.currentIndex];
    this.state.data[key] = {[videoUrl]: this.state.coordinateData};
    if (this.state.percent === 100) {
      this.setState({disabled: false})
      if (this.state.currentLevel >= this.state.maxLevels - 1) {
        this.setState({buttonText: 'SUBMIT'})
        return;
      }
      return;
    }
    this.setState({
      currentIndex: this.state.currentIndex + 1,
      coordinateData: [],
    })
  }

  _loadNextLevel() {
    this.setState({
      currentLevel: this.state.currentLevel + 1,
      percent: 0,
      currentIndex: 0,
      disabled: true,
      coordinateData: [],
    })
  }

  _handlePlayButton() {
    const vid = this.videoRef.current;
    if (vid.paused) {
      this.setState({pause: false});
      vid.play();
    } else {
      this.setState({pause: true});
      vid.pause();
    }
  }

  _makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  render() {
    const { classes } = this.props;
    const { buttonText, disabled, videoData,
            percent, currentLevel, currentIndex,
            maxLevels, anchorEl, brushSize, fullPlay } = this.state;
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    return (
      <MuiThemeProvider theme={THEME}>
        <div className={classes.root}>
          <div className={classes.topSection}>
            <Typography variant="h2" style={{marginBottom: 16}}>
                Deep Fake Click
            </Typography>
            <Button id="instruction-button" variant="contained" color="primary" onClick={this._handleClick}>Instructions</Button>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={this._handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <Button id="close-instruction-button" variant="contained" align="center" color="secondary" onClick={this._handleClose}>X</Button>

              <Typography variant="subtitle1" align="center" style={{padding: 16}}>
                <b>Instructions:</b>
                <br />
                Please only <b>mark areas of the face or close to the face</b> and <b>not</b> the background.
                < br/>
                Each video is <b>3 seconds</b> long. There will be 10 videos per level for 11 levels.
                You must view the full 3 second long video at least once before continuing to the next video.
                <br />
                To navigate the video use the <b>left</b> arrow key to go 1 second backwards, <b>right</b> arrow key to go 1 second forwards
                , and <b>space bar</b> to play/pause the video. <br />
                <br />
                All of these videos are <b>fake, AI-generated</b> videos. Please <b>click and drag</b> on the <b>right</b> video to highlight areas that gave you an indication this video was fake.
                The video will automatically pause whenver you are highlighting an area, and you must press the space bar to resume the video.
                <br />
                The video on the <b>left</b> indicates areas on the video that you have marked, and the color of the marked area indicates the time when the area was marked (green is early, red is late). <br />
                You are allowed to watch the video any number of times and navigate to specific times in the video. <br />
                <br />
                Please avoid making just one click on a video or marking a singular point. <br/>
                Also avoid circling the defects: paint them over instead. You can increase the brush size if you want to paint a large area. See the image below for reference.
                <br />

              </Typography>
              <div className={classes.gifContainer}>
                <img src={DoDont} width="80%" style={{}} />
              </div>
            </Popover>
            <Typography variant="h5" style={{marginTop: 32, marginBottom: 12}}>
              Current Level: {currentLevel + 1} / {maxLevels}
            </Typography>
            <div className={classes.levelProgress}>
              <Typography variant="caption">
                Level Progress:
              </Typography>
              <Progress
                style={{width: '70%', marginLeft: 8}}
                percent={Math.ceil(percent)}
                theme={{
                  active: {
                    symbol: Math.ceil(percent) + '%',
                    color: 'green'
                  },
                  success: {
                    symbol: Math.ceil(percent) + '%',
                    color: 'green'
                  }
                }}
              />
            </div>
          </div>
          <div className={classes.videoSection}>
            <div className={classes.subVideoSection}>
              <Typography>
                Areas You've Marked
              </Typography>
              <canvas id="myCanvas" ref={this.canvasRef} width={360} height={360} />
              <Button variant="contained" style={{borderRadius: 16, fontSize: 16, margin: 8}} onClick={() => this.setState({coordinateData: []})}>
                Clear Marks
              </Button>
            </div>
            <div className={classes.subVideoSection}>
              <Typography>
                Main Video (Click Here)
              </Typography>
              <video
                id="myVideo"
                src={videoData[currentLevel][currentIndex]}
                width={540}
                height={540}
                ref={this.videoRef}
                autoPlay
                loop
              />
              <Typography variant="caption" gutterBottom>
                Controls: <b>Space Bar</b>: Play/Pause | <b>Left Key</b>: Rewind 1 second | <b>Right Key</b>: Forward 1 second
              </Typography>
              <Button variant="contained" className={classes.startButton} onClick={this._handlePlayButton}>
                { this.state.pause ? "PLAY" : "PAUSE"}
              </Button>
              <Typography variant="subtitle">
                Adjust Brush Size ({brushSize} px):
              </Typography>
              <Slider style={{marginTop: 8, width: '40%'}} min={3} max={24} defaultValue={brushSize} handle={handle}
                  onAfterChange={(val) => this.setState({brushSize: val})} />
            </div>
          </div>

          <div style={{display: 'flex', flexDirection: 'row'}}>
            <Button disabled={!disabled || !fullPlay} variant="contained" className={classes.startButton} onClick={this._handleNextButton}>
              NEXT
            </Button>
            <Button disabled={disabled} variant="contained" className={classes.startButton} onClick={this._handleSubmitButton}>
              {buttonText}
            </Button>
          </div>
          <Typography>
            You must watch the full 3 second video and mark it before being able to click 'Next'.
          </Typography>
          <form id="submit-form" name="submit-form">
          </form>
          <Typography className={classes.irb} variant="caption">
            This HIT is part of a MIT scientific research project. Your decision to complete this HIT is voluntary. There is no way for us to identify you. The only information we will have, in addition to your responses, is the time at which you completed the study. The results of the research may be presented at scientific meetings or published in scientific journals. Clicking on the 'SUBMIT' button on the bottom of this page indicates that you are at least 18 years of age and agree to complete this HIT voluntarily.
          </Typography>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(DeepFakeClick);
