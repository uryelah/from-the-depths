const Bubble = (config) => {
  const { x, y, context } = config;

  const newBubble = context.add.tileSprite(x, y, 32, 32, 'bubble');

  newBubble.setScale(Math.random() + 0.7);

  context.physics.world.enable(newBubble);

  newBubble.body.setGravityY(-200);

  newBubble.setOrigin(0.5);

  context.sfx.bubble.play();

  newBubble.add = () => {
    context.playerSplats.add(newBubble);
  };

  return newBubble;
};

export default Bubble;
