var React = require('react-native');
var {
  StyleSheet,
  Text,
  View
} = React;

var ICONS = require('./constants').ICONS;

var InfoPanel = React.createClass ({
	propTypes: {
   title: React.PropTypes.string,
   description: React.PropTypes.string,
 },

 render: function() {
  var infoPanel;

  infoPanel = (
    <View style={styles.infoPanelNW}>
      <Text style={styles.infoPanelTitle}>{this.props.title}</Text>
      <Text style={styles.infoPanelDescription}>{this.props.description}</Text>
    </View>
    );

  return (
    <View style={styles.container}>
      {infoPanel}
    </View>
    )

}
});

var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
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
});

module.exports = InfoPanel;