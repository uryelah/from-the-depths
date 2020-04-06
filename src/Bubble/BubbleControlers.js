const BubbleControllers = (() => ({
  bubbleLife: (bubble, i) => {
    bubble.rotation += 0.05;
    if (bubble.y < 0) {
      bubble.destroy();
    }
  },
}))();

export default BubbleControllers;
