import React, { Component } from 'react';
import { View, Animated, PanResponder, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.5;
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
    this.resetPosition = this.resetPosition.bind(this);
    this.position = new Animated.ValueXY(0, 0);
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
    const x = (direction === 'left') ? -SCREEN_WIDTH : SCREEN_WIDTH;
    Animated.timing(position, {
      toValue: { x, y: 0 },
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
    Animated.spring(this.position, {
      toValue: { x: 0, y: 0 }
    }).start();
  }

  getCardStyle () {
    const position = this.position;
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ['-120deg', '0deg', '120deg']
    });

    return {
      ...position.getLayout(),
      transform: [{
        rotate
      }]
    };
  }

  renderCards () {
    const { index } = this.state;
    if (index >= this.props.data.length){
      return this.props.renderNoMoreCards();
    }

    return this.props.data.map((item, idx) => {
      if (idx < index) { return null; }
      if(idx === index) {
        return (
          <Animated.View
            key={item.id}
            style={[this.getCardStyle(), styles.cardStyle, { zIndex: 99 }]}
            {...this.panResponder.panHandlers}>
            {this.props.renderCard(item)}
          </Animated.View>
        )
      }
      return (
        <Animated.View key={item.id} style={[styles.cardStyle, { top: 10 * (idx - this.state.index), zIndex: 5 }]}>
          { this.props.renderCard(item) }
        </Animated.View>
      )
    }).reverse();
  }

  render () {
    return (
      <View>
        { this.renderCards() }
      </View>
    )
  }
}

const styles = {
  cardStyle: {
    position: 'absolute',
    width: SCREEN_WIDTH
  }
}

export default Deck;