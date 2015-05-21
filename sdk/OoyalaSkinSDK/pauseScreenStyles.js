var React = require('react-native');

var styles = React.StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start'
  },

  fullscreenContainer: {
  	flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },

  promoImageSmall: {
    width: 180,
    height: 90,
    margin: 20,
  },

  playButtonCenter: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  playButtonSE: {
    position: 'absolute',    
    bottom: 0,
    right: 0
  },

  playButtonSW: {
    position: 'absolute',    
    bottom: 0,
    left: 0
  },

  playButton: {
    fontSize: 40,
    textAlign: 'center',
    color: 'white',
    fontFamily: 'fontawesome',
    margin: 10
  },
});

module.exports = styles;

