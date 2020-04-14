const Fish = (config) => {
  const {
    x, y, direction, context, sprite,
  } = config;

  const newFish = context.add.tileSprite(x, y, 32, 32, sprite);

  newFish.direction = direction;

  newFish.setScale(1);

  context.physics.world.enable(newFish);

  newFish.add = () => {
    context.fishes.push(newFish);
  };

  return newFish;
};

export default Fish;
