import React, { Component } from 'react';
import { View, Animated, PanResponder, Dimensions } from 'react-native';

const SCREEN_WITH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WITH * 0.5;
const SWIPE_OUT_DURATION = 500;

class Deck extends Component {
  constructor () {
    super();

    this.getCardStyle = this.getCardStyle.bind(this);
    this.position = new Animated.ValueXY(0, 0);
    this.resetPosition = this.resetPosition.bind(this);
    this.forceSwipeCard = this.forceSwipeCard.bind(this);
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, { dx, dy }) => {
        this.position.setValue({ x: dx });
      },
      onPanResponderRelease: (event, { dx }) => {
        if (dx > SWIPE_THRESHOLD) {
          this.forceSwipeCard(SCREEN_WITH);
        }else if (dx < -SWIPE_THRESHOLD) {
          this.forceSwipeCard(-SCREEN_WITH);
        } else {
          this.resetPosition();
        }
      }
    });
  }

  forceSwipeCard (x) {
    const position = this.position;
    Animated.timing(position, {
      toValue: { x },
      duration: SWIPE_OUT_DURATION // ms.
    }).start();
  }

  resetPosition () {
    const position = this.position;
    Animated.spring(position, {
      toValue: { x: 0, y: 0 }
    }).start();
  }

  getCardStyle () {
    const position = this.position;
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WITH * 1.5, 0, SCREEN_WITH * 1.5],
      outputRange: ['-120deg', '0deg', '120deg']
    });

    return {
      ...this.position.getLayout(),
      transform: [{
        rotate
      }]
    };
  }

  renderCards () {
    return this.props.data.map((item, index) => {
      if(index === 0) {
        return (
          <Animated.View
            key={item.id}
            style={this.getCardStyle()}
            {...this.panResponder.panHandlers}>
            { this.props.renderCard(item) }
          </Animated.View>
        )
      }
      return this.props.renderCard(item);
    });
  }

  render () {
    return (
      <View>
        { this.renderCards() }
      </View>
    )
  }
}

export default Deck;