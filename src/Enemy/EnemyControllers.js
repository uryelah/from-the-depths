/* eslint-disable no-param-reassign */
import Enemy from './Enemy';

import Utils from '../helpers/Utils';

const { refreshStatus } = Utils;

const EnemyControllers = (() => ({
  populateEnemies: (context) => {
    for (let i = 0; i < 1 + (context.level / 2); i += 1) {
      if (i > 10) {
        break;
      }

      Enemy({ type: 'plain', context }).add();
    }

    for (let i = 0; i < (context.level / 3); i += 1) {
      if (i > 4) {
        break;
      }

      Enemy({ type: 'armed', context }).add();
    }

    if (!context.submarine && Math.random() < 0.05 * context.level) {
      Enemy({ type: 'submarine', context }).add();
    }
  },

  enemyShot: (context, playerBody, bubble, enemy, i) => {
    if (enemy && Math.abs(bubble.x - enemy.x) < 20
        && enemy.y - bubble.y > 2) {
      enemy.hp -= 1;
      bubble.destroy();

      if (enemy.hp <= 0) {
        if (enemy.type === 'submarine') {
          context.submarine = false;
          context.player.add2Score(14);
          enemy.ray.destroy();
          context.sfx.breakSub.play();
        } else {
          context.sfx.gasp.play();
        }
        enemy.destroy();
        context.divers.splice(i, 1, null);
        context.player.add2Score(1);
        context.sfx.shot.play();
        refreshStatus({ score: true }, context);
        playerBody.setCarrying(false);
      }
    }
  },

  enemyMovement: (context, enemy, i, frames, playerBody) => {
    if (enemy !== null) {
      if (enemy.type !== 'submarine') {
        if ((frames % 50) + i < i + 10) {
          if (enemy) { enemy.setFrame(0); }
        } else if ((frames % 50) + i < i + 20) {
          if (enemy) { enemy.setFrame(1); }
        } else if ((frames % 50) + i < i + 30) {
          if (enemy) { enemy.setFrame(2); }
        } else if ((frames % 50) + i < i + 40) {
          if (enemy) { enemy.setFrame(3); }
        } else if ((frames % 50) + i < i + 50) {
          if (enemy) { enemy.setFrame(4); }
        }
      }
      if (enemy !== playerBody.isCarrying() || (enemy.type === 'submarine' && context.rayOn)) {
        enemy.y += 1 * (enemy.velocity ? enemy.velocity : 1);
      } if (enemy.y - enemy.displayHeight > context.sys.game.config.height) {
        if (enemy.type === 'submarine') {
          enemy.ray.destroy();
          context.submarine = false;
          context.player.decrementHp(10);
          context.sfx.submarine.setLoop(false);
          context.sfx.submarine.stop();
          refreshStatus({ hp: true }, context);
        }
        enemy.destroy();
        context.divers.splice(i, 1, null);
        context.sfx.rip.play();
        refreshStatus({ hp: true }, context);
        context.player.decrementHp(1);
      }


      if (enemy.type === 'submarine') {
        enemy.x += 0.5 * enemy.direction;

        if (enemy.x < 0 || enemy.x > context.game.config.width) {
          enemy.direction = -enemy.direction;
          enemy.setScale(-enemy.direction, 1);
        }
      } else if (enemy.smart && Math.abs(enemy.x - context.mainContainer.x) < 50
          && Math.abs(enemy.y - context.mainContainer.y) < 50) {
        if (enemy.y < context.mainContainer.y) {
          enemy.y -= 5;
          enemy.x -= 5;
        } else {
          enemy.y += 5;
          enemy.x += 5;
        }
        enemy.shootClock = 0;
        context.sfx.push.play();
        enemy.hp -= 0.05;
        context.player.decrementHp(0.05);
        if (enemy.hp < 0) {
          enemy.destroy();
          context.divers.splice(i, 1, null);
          context.sfx.rip.play();
        }
      } else if (Math.random() < 0.5) {
        enemy.x -= 5;
      } else {
        enemy.x += 5;
      }

      if (enemy.type !== 'submarine' && enemy !== null) {
        if (enemy.x <= 0) {
          enemy.x += 25;
        } else if (enemy.x >= context.game.config.width) {
          enemy.x -= 25;
        }
      }
    }
  },

  enemyGrabbed: (diver, i, fallX, fallY, playerBody) => {
    if (diver.type !== 'submarine' && fallY - diver.y < 50
        && Math.abs(fallX - diver.x) < 50) {
      diver.fall = false;
      playerBody.setCarrying(diver);
      playerBody.isCarrying().id = i;
    }
  },

  enemySqueezed: (context, diver, i, shot, arr) => {
    if (diver === null) { return; }
    if (Math.abs(arr[0].y - diver.y) < 40 && Math.abs(arr[0].x - diver.x) < 50) {
      if (diver.type === 'submarine') {
        context.player.decrementHp(5);
        context.sfx.subHug.play();
        setTimeout(() => {
          context.sfx.subHug.stop();
        }, 3000);
        refreshStatus({ hp: true }, context);
      } else {
        diver.destroy();
        context.divers.splice(i, 1, null);
        context.pontuation += 1;
        context.sfx.gasp.play();
        context.sfx.rip.play();
        refreshStatus({ score: true }, context);
        shot = false;
      }
    }
  },

  // eslint-disable-next-line no-unused-vars
  enemyCollisions: (context, diver, playerBody, shot, i) => {
    if (diver === null) { return; }
    if (diver.smart) {
      if (diver.shootClock === 0) {
        diver.shootClock = 20;
        const spear = context.add.tileSprite(diver.x, diver.y, 16, 16, 'shot');
        spear.velocity = {
          goal: [context.mainContainer.x,
            context.mainContainer.y],
          x: (context.mainContainer.x - diver.x) / 15,
          y: (context.mainContainer.y - diver.y) / 15,
        };

        context.spears.push(spear);
        context.physics.world.enable(spear);
        spear.setOrigin(0.5, 0.5);
        spear.body.setSize(16, 16);
        context.physics.add.collider(spear, context.mainContainer, () => {
          console.log(playerBody, playerBody.isCarrying);
          const grabbedDiver = playerBody.isCarrying();
          if (grabbedDiver) {
            grabbedDiver.hp -= 1;

            if (grabbedDiver.hp <= 0) {
              grabbedDiver.destroy();
              context.divers.splice(grabbedDiver.id, 1, null);
              playerBody.setCarrying(false);
              shot = false;
            }
          } else {
            context.player.decrementHp(0.5);
            refreshStatus({ hp: true }, context);
          }
          spear.destroy();
          context.spears.splice(context.spears.indexOf(spear), 1);
        }, null, context);
      }
      diver.shootClock -= 1;
    } else if (diver.type === 'submarine' && !diver.ray && diver.timeToRay <= 0) {
      const ray = context.add.sprite(diver.x, 0, 'ray');
      ray.setDepth(10);
      ray.setOrigin(0.5, 0);
      // ray.displayWidth = ray.displayWidth * 0.3;
      ray.setVisible(false);
      context.physics.world.enable(ray);
      ray.body.setSize(ray.displayWidth, ray.displayWidth);
      ray.body.setOffset(0, 200);
      diver.ray = ray;
    } else if (diver.type === 'submarine' && diver.ray && Math.abs(diver.x - context.game.config.width / 2) < 30) {
      context.rayOn = true;
      diver.ray.setVisible(true);
      context.head.y = context.game.config.height;
      context.sfx.rayStart.play();
      diver.ray.x = diver.x - (7 * -diver.direction);
      diver.ray.y = diver.y;
      diver.ray.displayHeight = context.game.config.height - diver.displayHeight - (diver.y / 2);
      diver.ray.body.setSize(100, diver.ray.displayHeight);
      diver.ray.body.setOffset(0, 0);

      let curColide = context.mainContainer;
      let colideCount = 0;

      while (curColide.list.length > 1 && colideCount < 10) {
        colideCount += 1;
        context.physics.add.collider(diver.ray, curColide, () => {
          if (context.rayOn) {
            context.player.decrementHp(0.025);
            refreshStatus({ hp: true }, context);
            context.sfx.ray.play();
          }
        }, null, context);
        [, curColide] = curColide.list;
      }
    } else if (diver.type === 'submarine' && diver.ray && !Math.abs(diver.x - context.game.config.width / 2) < 30) {
      diver.ray.setVisible(false);
      context.rayOn = false;
      if (context.head.y > context.game.config.height / 1.5) {
        context.head.y -= 2;
      }
      context.sfx.ray.stop();
    } else if (diver.type === 'submarine') {
      diver.timeToRay -= 1;
    }
  },
}))();

export default EnemyControllers;
