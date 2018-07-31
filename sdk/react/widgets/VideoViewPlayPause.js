import PropTypes from 'prop-types';
import React from 'react';
import {
  View,
  TouchableHighlight,
  Animated
} from 'react-native';
import SkipButton from './SkipButton'

const Constants = require('../constants');
const {
  BUTTON_NAMES
} = Constants;

// Uses the rectbutton styles
const styles = require('../utils').getStyles(require('./style/RectButtonStyles.json'));
const PLAY = "play";
const PAUSE = "pause";
const FORWARD = "seekForward";
const BACKWARD = "seekBackward";

class VideoViewPlayPause extends React.Component {
  static propTypes = {
    icons: PropTypes.object,
    position: PropTypes.string,
    onPress: PropTypes.func,
    onSeekPressed: PropTypes.func,
    seekForwardValue: PropTypes.number,
    seekBackwardValue: PropTypes.number,
    opacity: PropTypes.number,
    frameWidth: PropTypes.number,
    frameHeight: PropTypes.number,
    buttonWidth: PropTypes.number,
    buttonHeight: PropTypes.number,
    buttonColor: PropTypes.string,
    buttonStyle: PropTypes.object,
    fontSize: PropTypes.number,
    style: PropTypes.object,
    showButton: PropTypes.bool,
    showSeekButtons: PropTypes.bool,
    playing: PropTypes.bool,
    loading: PropTypes.bool,
    initialPlay: PropTypes.bool
  };

  state = {
    play: {
      animationScale: new Animated.Value(1),
      animationOpacity: new Animated.Value(1)
    },
    pause: {
      animationScale: new Animated.Value(1),
      animationOpacity: new Animated.Value(0)
    },
    widget: {
      animationOpacity: new Animated.Value(0)
    },
    skipButtons: {
      animationScale: new Animated.Value(1),
      animationOpacity: new Animated.Value(0)
    },
    showInitialPlayAnimation: this.props.initialPlay,
    inAnimation: false
  };

  componentWillMount() {
    // initialize animations.
    if (this.props.initialPlay) {
      this.state.widget.animationOpacity.setValue(1);
      this.state.play.animationOpacity.setValue(1);
      this.state.pause.animationOpacity.setValue(0);
      this.state.skipButtons.animationOpacity.setValue(0);
    } else {
      this.state.widget.animationOpacity.setValue(this.props.showButton ? 1 : 0);
      this.state.play.animationOpacity.setValue(this.props.playing ? 0 : 1);
      this.state.pause.animationOpacity.setValue(this.props.playing ? 1 : 0);
      this.state.skipButtons.animationOpacity.setValue(1);
    }
  }

  componentDidMount() {
    if (this.state.showInitialPlayAnimation) {
      this.animatePlayButton();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.showButton !== this.props.showButton) {
      const widgetOpacity = nextProps.showButton ? 1 : 0;

      Animated.timing(this.state.widget.animationOpacity, {
        toValue: widgetOpacity,
      }).start();
    }

    if (nextProps.playing !== this.props.playing) {
      if (!this.state.inAnimation) {
        this.syncButtons(nextProps.playing);
      }
    }
  }

  onPress = () => {
    if (this.props.showButton) {
      if (this.props.playing) {
        this.showPlayButton();
      } else {
        this.animatePlayButton();
      }
      this.props.onPress(BUTTON_NAMES.PLAY_PAUSE);
    } else {
      this.props.onPress(BUTTON_NAMES.RESET_AUTOHIDE);
    }
  };

  onAnimationCompleted = (instance) => {
    this.state.widget.animationOpacity.setValue(this.props.showButton ? 1 : 0);
    this.setState({inAnimation: false});
    this.syncButtons(this.props.playing);
  };

  // Animations for play/pause transition
  animatePlayButton = () => {
    this.setState({inAnimation: true});
    this.state.play.animationScale.setValue(0.5);
    this.state.play.animationOpacity.setValue(0);

    Animated.parallel([
      Animated.timing(this.state.play.animationOpacity, {
        toValue: 1
      }),
      Animated.timing(this.state.play.animationScale, {
        toValue: 1
      }),
    ]).start(this.onAnimationCompleted);
  };

  showPlayButton = () => {
    this.state.pause.animationOpacity.setValue(0);
    this.state.play.animationOpacity.setValue(1);
    this.state.play.animationScale.setValue(1);
  };

  showPauseButton = () => {
    this.state.pause.animationOpacity.setValue(1);
    this.state.play.animationOpacity.setValue(0);
  };

  _renderPlayPauseButton = () => {
    if (this.state[PLAY].animationOpacity._value === 0) {
      return this._renderButton(PAUSE);
    }
    return this._renderButton(PLAY);
  };

  _renderButton = (name) => {
    console.log("Button name: " + name +  " animation opacity is: " + this.state[name].animationOpacity._value);
    const fontStyle = {fontSize: this.props.fontSize, fontFamily: this.props.icons[name].fontFamily};
    const opacity = {opacity: this.state[name].animationOpacity};
    const animate = {transform: [{scale: this.state[name].animationScale}]};
    const buttonColor = {color: !!this.props.buttonColor ? this.props.buttonColor : "white"};
    const sizeStyle = {width: this.props.buttonWidth * 2, height: this.props.buttonHeight * 2};

    const label = name + " button. Press twice to play video";

    return (
      <TouchableHighlight
        accessible={true}
        accessibilityLabel={label}
        onPress={() => this.onPress()}
        underlayColor="transparent"
        activeOpacity={this.props.opacity}
        importantForAccessibility={'auto'}
        style={[sizeStyle, {justifyContent: 'center', alignItems: 'center'}]}>
        <Animated.Text
          accessible={false}
          style={[styles.buttonTextStyle, fontStyle, buttonColor, this.props.buttonStyle, animate, opacity]}>
          {this.props.icons[name].icon}
        </Animated.Text>
      </TouchableHighlight>
    );
  };

  _renderSeekButton = (name, iconScale) => {
    if (!this.props.showSeekButtons) {
      return <View/>
    }
    const fontStyle = {fontSize: this.props.fontSize * iconScale, fontFamily: this.props.icons[name].fontFamily};
    const sizeStyle = {width: this.props.buttonWidth, height: this.props.buttonHeight};
    const opacity = {opacity: this.state.skipButtons.animationOpacity};
    const animate = {transform: [{scale: this.state.skipButtons.animationScale}]};
    const buttonColor = {color: !!this.props.buttonColor ? this.props.buttonColor : "white"};
    const isForward = name === FORWARD;
    const seekValue = isForward ? this.props.seekForwardValue : this.props.seekBackwardValue;

    return (
      <SkipButton
        isForward={isForward}
        timeValue={seekValue}
        sizeStyle={sizeStyle}
        onSeek={(isForward) => this.props.onSeekPressed(isForward)}
        icon={this.props.icons[name].icon}
        fontStyle={fontStyle}
        opacity={opacity}
        animate={animate}
        buttonColor={buttonColor}
      />
    );
  };

  syncButtons = (playing) => {
    if (playing) {
      this.showPauseButton();
    } else {
      this.showPlayButton();
    }
  };

  // Gets the play button based on the current config settings
  render() {
    const seekButtonScale = 0.5;
    const playPauseButton = this._renderPlayPauseButton();
    const backwardButton = this._renderSeekButton(BACKWARD, seekButtonScale);
    const forwardButton = this._renderSeekButton(FORWARD, seekButtonScale);

    const containerStyle = {
      flexDirection: 'row',
      flex: 0,
      justifyContent: 'space-between',
      alignItems: 'center'
    };

    if (!this.props.showButton) {
      return null;
    } else {
      return (
        <View style={[styles.buttonTextContainer]}>
          <Animated.View style={[containerStyle]}>
            {backwardButton}
            {playPauseButton}
            {forwardButton}
          </Animated.View>
        </View>
      );
    }
  }

}

module.exports = VideoViewPlayPause;
