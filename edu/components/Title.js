import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  Button
} from 'react-native';

export default class Title extends React.Component {
  render() {
    return (<>
    <View style={styles.titleContainer}><Text {...this.props} style={[this.props.style, { fontSize: 40, fontWeight: "bold" }]}>{this.props.text}</Text></View>
    </>)
  }
}

const styles = StyleSheet.create({
  titleContainer: {
    marginTop: 8,
    marginBottom: 20,
  }
})
