import React, { Component } from 'react';
import { View, Animated, PanResponder, Dimensions } from 'react-native';

const SCREEN_WITH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WITH * 0.5;
const SWIPE_OUT_DURATION = 500;

class Deck extends Component {
  static defaultProps = {
    onSwipeLeft: () => { console.log('default onSwipeLeft') },
    onSwipeRight: () =>{ console.log('default onSwipeRight') }
  }

  constructor () {
    super();
    this.state = { index: 0 };
    this.getCardStyle = this.getCardStyle.bind(this);
    this.position = new Animated.ValueXY(0, 0);
    this.resetPosition = this.resetPosition.bind(this);
    this.swipeCard = this.swipeCard.bind(this);
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, { dx, dy }) => {
        this.position.setValue({ x: dx });
      },
      onPanResponderRelease: (event, { dx }) => {
        if (dx > SWIPE_THRESHOLD) {
          this.swipeCard('right');
        }else if (dx < -SWIPE_THRESHOLD) {
          this.swipeCard('left');
        } else {
          this.resetPosition();
        }
      }
    });
  }

  swipeCard (direction) {
    const position = this.position;
    const x = (direction === 'left') ? -SCREEN_WITH : SCREEN_WITH;
    Animated.timing(position, {
      toValue: { x },
      duration: SWIPE_OUT_DURATION // ms.
    }).start(() => this.onSwipeComplete(direction));
  }

  onSwipeComplete (direction) {
    const { onSwipeLeft, onSwipeRight } = this.props;
    const item = this.props.data[this.state.index];
    direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item);
    this.position.setValue({ x: 0, y: 0 });
    this.setState({ index: this.state.index + 1 });
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
    const { index } = this.state;
    return this.props.data.map((item, idx) => {
      if (idx < index) return null;
      if(idx === index) {
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