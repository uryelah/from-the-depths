const Enemy = (config) => {
  const { type, context } = config;

  let sprite;

  if (type === 'plain') {
    sprite = 'diver';
  } else if (type === 'armed') {
    sprite = 'diverSmart';
  } else if (type === 'submarine') {
    sprite = 'submarine';
  }

  const newEnemy = context.add.tileSprite(context.mainContainer.x, 0, type === 'submarine' ? 128 : 32, type === 'submarine' ? 96 : 32, sprite);

  newEnemy.fall = true;

  switch (type) {
    case 'plain':
      newEnemy.hp = context.level < 2 ? 1 : 2;
      newEnemy.smart = false;
      break;
    case 'armed':
      newEnemy.hp = 3;
      newEnemy.smart = true;
      newEnemy.shootClock = 10;
      break;
    case 'submarine':
      newEnemy.setDepth(50);
      context.submarine = true;
      newEnemy.velocity = 0.2;
      newEnemy.type = 'submarine';
      newEnemy.timeToRay = 100;
      newEnemy.hp = 20;
      newEnemy.smart = false;
      newEnemy.direction = 1;
      newEnemy.setScale(-newEnemy.direction, 1);
      context.divers.push(newEnemy);
      context.sfx.submarine.setLoop(true);
      context.sfx.submarine.play();
      newEnemy.smart = false;
      break;
    default:
      newEnemy.hp = 2;
      newEnemy.smart = false;
      break;
  }

  newEnemy.add = () => {
    context.divers.push(newEnemy);
  };

  return newEnemy;
};

export default Enemy;
