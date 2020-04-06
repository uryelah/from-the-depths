/* eslint-disable no-param-reassign */
import Fish from './Fish';

import Utils from '../helpers/Utils';

const { refreshStatus } = Utils;

const FishControllers = (() => ({
  populateFishes: (context) => {
    let fish;
    for (let i = 0; i < 5; i += 1) {
      fish = Fish({
        x: Math.random() * context.game.config.width, y: (Math.random() * (context.game.config.height - 200)) + 200, direction: 1, context, sprite: 'fish',
      });
      fish.add();
    }
  },

  moveFishes: (fishBag, context, frames) => {
    [...fishBag].forEach((fish, i) => {
      if (fish !== null) {
        fish.x += 0.5 * fish.direction;

        if ((frames % 48) * (i + 1) < 24 * (i + 1)) {
          fish.y -= 0.2;
        } else {
          fish.y += 0.2;
        }

        if (fish && frames % 48 < 16) {
          fish.setFrame(0);
        } else if (frames % 48 < 32) {
          fish.setFrame(1);
        } else {
          fish.setFrame(2);
        }

        if (fish.x > context.game.config.width) {
          fish.x = -(Math.random() * 10);
          fish.y = (Math.random() * (context.game.config.width - 200)) + 200;
        }
      }
    });

    return fishBag.filter((n) => n !== null);
  },

  replenishFishes: (context) => {
    if (context.fishes.length < 5) {
      Fish({
        x: -Math.random() * context.game.config.width, y: (Math.random() * (context.game.config.height - 200)) + 200, direction: 1, context, sprite: 'fish',
      }).add();
    }
  },

  canEatFish: (context, playerArr, fish, i) => {
    if (fish && Math.abs(playerArr[0].y - fish.y) < 30 && Math.abs(playerArr[0].x - fish.x) < 30) {
      context.sfx.eat.play();
      fish.destroy();
      context.fishes.splice(i, 1, null);
      context.player.incrementHp(1);
      refreshStatus({ hp: true }, context);
    }
  },
}))();

export default FishControllers;
