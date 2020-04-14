/* eslint-disable no-param-reassign */
const BubbleControllers = (() => ({
  bubbleLife: (bubble) => {
    bubble.rotation += 0.05;
    if (bubble.y < 0) {
      bubble.destroy();
    }
  },
}))();

export default BubbleControllers;
