import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card, Button } from 'react-native-elements';
import Deck from './src/Deck';
import DATA from './assets/data';

export default class App extends Component {
  renderCard (item) {
    return (
      <Card
        image={{ uri: item.uri }}
        key={item.id}>
        <Text style={{ fontWeight: 'bold', marginBottom: 10}}>
          {item.text}
        </Text>
        <Text style={{ marginBottom: 10}}>Lorem ipsum asimet dolor quo ipso facto.</Text>
        <Button
          icon={{name: 'code'}}
          title="View Now!"></Button>
      </Card>
    )
  }

  renderNoMoreCards () {
    return <Card title="All done!">
      <Text style={{ marginBottom: 10 }}>
        There's no more content here!
      </Text>
      <Button backgroundColor="#03A9F4"
      title="Get more!" />
    </Card>;
  }

  onSwipeLeft () {
  }

  onSwipeRight () {
  }

  render() {
    return (
      <View style={styles.container}>
        <Deck
          data={DATA}
          renderCard={this.renderCard}
          renderNoMoreCards={this.renderNoMoreCards}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
});