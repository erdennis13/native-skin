var React = require('react-native');

var styles = React.StyleSheet.create({
  fullscreenContainer: {
    flex: 1,
    alignItems: 'stretch',
  },
  panelTitle: {
    flex: 1,
    fontSize: 40,
    textAlign: 'left',
    color: 'white',
    padding: 20
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginBottom: 6,
    marginTop: 6,
    marginLeft: 12,
  },
  rightContainer: {
    flex: 1,
    marginLeft: 8
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    fontFamily: 'Arial-BoldMT',
    textAlign: 'left',
    color: 'white',
  },
  description: {
    fontSize: 16,
    marginBottom: 8,
    fontFamily: 'Arial',
    textAlign: 'left',
    color: '#ADADAD',
  },
  thumbnail: {
    width: 112,
    height: 63,
  },
  listView: {
    backgroundColor: '#333333',
  },
});

module.exports = styles;

