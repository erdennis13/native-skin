var React = require('react-native');

var styles = React.StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start'
  },

  promoImageSmall: {
    width: 180,
    height: 90,
    margin: 20,
  },

  infoPanelNW: {
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },

  infoPanelSW: {
    position: 'absolute',    
    bottom: 0,
    left: 0
  },

  infoPanelTitle: {
    textAlign: 'left',
    fontSize: 20,
    fontFamily: 'Arial-BoldMT',
    color: 'white',
    marginTop: 20,
    marginLeft: 10
  },

  infoPanelDescription: {
    textAlign: 'left',
    fontSize: 16,
    fontFamily: 'ArialMT',
    color: 'white',
    margin: 10
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

  waterMarkImageSW: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },

  waterMarkImageSE: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },

  waterMarkImage: {
    width:160,
    height: 24,
    alignItems: 'center',
    backgroundColor: 'transparent',
    margin: 10
  }
});

module.exports = styles;

