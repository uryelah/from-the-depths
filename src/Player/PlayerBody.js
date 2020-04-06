/* eslint-disable no-param-reassign */
import EnemyControllers from '../Enemy/EnemyControllers';

import Utils from '../helpers/Utils';

const { enemySqueezed } = EnemyControllers;

const { refreshStatus } = Utils;

const PlayerBody = (config) => {
  const { segments } = config;

  let carrying = false;

  const { coords } = config;

  let goalX = coords[0] / 2;

  let goalY = coords[1] / 2;

  const isCarrying = () => carrying;

  const getGoalX = () => goalX;

  const getGoalY = () => goalY;

  let goalAngle = 0;

  let previousAngle = 0;

  const getGoalAngle = () => goalAngle;

  const getPreviousAngle = () => previousAngle;

  const setAngle = (angle) => {
    previousAngle = goalAngle;
    goalAngle = angle;
  };

  const setCarrying = (bool) => {
    carrying = bool;
  };

  const setGoalX = (n) => {
    goalX = n;
  };
  const setGoalY = (n) => {
    goalY = n;
  };

  const getSegments = () => segments;

  const squeeze = (context, container, i, arr, shot, clickDirection, grab, canEatFish) => {
    if (i === 2 && Math.abs(container.rotation) > 1.1) {
      if (isCarrying()) {
        isCarrying().destroy();
        context.divers.splice(isCarrying().id, 1, null);
        context.player.add2Score(1);
        refreshStatus({ score: true }, context);
        setCarrying(false);
        // eslint-disable-next-line no-param-reassign
        shot = false;
      } else {
        [...context.divers].forEach((diver, l) => enemySqueezed(context, diver, l, shot, arr));
        [...context.fishes].forEach((fish, j) => canEatFish(context, arr, fish, j));
      }
    }
    if (i < 5) {
      if (context.clickDirection < 0) {
        container.rotation -= grab * (2);
      } else {
        container.rotation += grab * (2);
      }
    } else if (i < 9) {
      if (context.clickDirection < 0) {
        container.rotation += 2 * grab;
      } else {
        container.rotation -= 2 * grab;
      }
    } else if (context.clickDirection < 0) {
      container.rotation += grab / 1.8;
    } else {
      container.rotation -= grab / 1.8;
    }
  };

  const generateTentacleParts = (context, image, playerTentacle, playerBody) => {
    let previousContainer = playerTentacle;
    let previousImg = image;
    for (let i = 0; i < playerBody.getSegments(); i += 1) {
      const newImg = context.make.image({
        x: 0, y: 0, key: 'logo', add: false,
      });
      newImg.setScale((0.02 * (i + 0.5)) + 0.05);
      newImg.displayWidth -= (i * 2);
      const newContainer = context.add.container(0, previousImg.displayHeight);
      newContainer.add(newImg);
      previousContainer.add(newContainer);
      previousContainer = newContainer;
      previousImg = newImg;
      context.containers.push(previousContainer);
      context.physics.world.enable(newContainer);
      newContainer.body.setOffset((-2.5 * i) - 15, (-2.5 * i) - 15);
      newContainer.body.setSize(newImg.displayWidth + 2, newImg.displayHeight + 2);
    }
    context.physics.world.enable(playerTentacle);
    playerTentacle.body.setCollideWorldBounds(true);
    playerTentacle.body.setOffset(-10, -10);
    playerTentacle.body.setSize(22, 20);
  };

  const iddleBody = (playerTentacle) => {
    if (Math.abs(playerTentacle.rotation) > 0.05) {
      if (playerTentacle.rotation > 0) {
        playerTentacle.rotation -= 0.025;
      } else if (playerTentacle.rotation < 0) {
        playerTentacle.rotation += 0.025;
      }
    }
  };

  const accomodate = (context, container, i) => {
    if (context.player.isStill()) {
      if (i === 0) {
        if (context.frame % 22 < 11) {
          container.x += 1;
        } else {
          container.x -= 1;
        }
      }
      if (i > 1 && i < 5) {
        if (context.frame % 22 < 11) {
          container.rotation -= 0.25 / (i * 10);
        } else {
          container.rotation += 0.25 / (i * 10);
        }
      } else if (i > 5 && i < 8) {
        if (context.frame % 22 < 11) {
          container.rotation += 0.25 / (i * 10);
        } else {
          container.rotation -= 0.25 / (i * 10);
        }
      }
    }
    if (Math.abs(container.rotation) > 0.01) {
      if (container.rotation > 0) {
        container.rotation -= 0.01;
      } else if (container.rotation < 0) {
        container.rotation += 0.01;
      }
    }
  };

  const moveToAngle = (context, playerTentacle, playerBody) => {
    if (playerTentacle.rotation < playerBody.getGoalAngle()) {
      playerTentacle.rotation += 0.1;
    } else {
      playerTentacle.rotation -= 0.1;
    }

    context.containers.forEach((container, i) => {
      if (i < 18) {
        if (container.rotation < playerBody.getGoalAngle() / i) {
          container.rotation += 0.1 - (i * 0.005);
        } else {
          container.rotation -= 0.1 - (i * 0.005);
        }
      } else if (container.rotation < -playerBody.getGoalAngle() / (i)) {
        container.rotation += 0.1 - (i * 0.001);
      } else {
        container.rotation -= 0.1 - (i * 0.001);
      }
    });
  };

  const turnTentacle = (containers, playerBody, absSubstract) => {
    containers.forEach((container, i) => {
      if (i < 18) {
        if (absSubstract(playerBody.getGoalAngle(), playerBody.getPreviousAngle()) > 0.05
          && absSubstract(container.rotation, playerBody.getPreviousAngle()) > 0.05) {
          if (i === 0) {
            if (container.rotation < (playerBody.getPreviousAngle() * i)) {
              container.rotation += 0.1 - (i * 0.005);
            } else {
              container.rotation -= 0.1 - (i * 0.005);
            }
          } else if (container.rotation < playerBody.getPreviousAngle()) {
            container.rotation += 0.1 - (i * 0.005);
          } else {
            container.rotation -= 0.1 - (i * 0.005);
          }
          if (i === 0) {
            if (container.rotation < playerBody.getGoalAngle() * i) {
              container.rotation += 0.1 - (i * 0.005);
            } else {
              container.rotation -= 0.1 - (i * 0.005);
            }
          } else if (container.rotation < playerBody.getGoalAngle()) {
            container.rotation += 0.1 - (i * 0.005);
          } else {
            container.rotation -= 0.1 - (i * 0.005);
          }
        } else if (i === 0) {
          if (container.rotation < playerBody.getGoalAngle() * i) {
            container.rotation += 0.1 - (i * 0.005);
          } else {
            container.rotation -= 0.1 - (i * 0.005);
          }
        } else if (container.rotation < playerBody.getGoalAngle()) {
          container.rotation += 0.1 - (i * 0.005);
        } else {
          container.rotation -= 0.1 - (i * 0.005);
        }
      } else if (container.rotation < -playerBody.getGoalAngle()) {
        container.rotation -= 0.07;
      } else {
        container.rotation += 0.07;
      }
    });
  };

  const moveHead = (e, context) => {
    if (e.position.x > context.game.config.width / 2) {
      context.head.x += 0.5;
    } else {
      context.head.x -= 0.5;
    }

    if (e.position.y < context.game.config.width / 2 && context.head.y > context.game.config.width / 2) {
      context.head.y -= 0.5;
    } else if (e.position.y > context.game.config.width / 1.2) {
      context.head.y += 0.5;
    } else if (context.head.y < context.game.config.height / 1.5) {
      context.head.y += 1;
    } else if (context.head.y > context.game.config.height / 1.5) {
      context.head.y -= 1;
    }
  };

  const bounceHead = (context) => {
    if (context.player.isStill()) {
      if (context.frame % 80 < 40) {
        context.head.y += 0.5;
      } else {
        context.head.y -= 0.5;
      }
    }
  };

  return {
    getSegments,
    getGoalX,
    getGoalY,
    setGoalX,
    setGoalY,
    isCarrying,
    setCarrying,
    getGoalAngle,
    getPreviousAngle,
    generateTentacleParts,
    turnTentacle,
    moveToAngle,
    accomodate,
    bounceHead,
    iddleBody,
    moveHead,
    setAngle,
    squeeze,
  };
};

export default PlayerBody;
