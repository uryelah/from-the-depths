import Phaser from 'phaser';

import Player from './Player';

import PlayerBody from './PlayerBody';

import Enemy from './Enemy';

import Bubble from './Bubble';

import BubbleControllers from './BubbleControlers';

import SpearControllers from './SpearControllers';

import EnemyControllers from './EnemyControllers';

import FishControllers from './FishControllers';

import Utils from './helpers/Utils';

import PreLoader from './helpers/Preloader';

const { bubbleLife } = BubbleControllers;

const {
  absSubstract, animateBg, refreshStatus, endGame,
} = Utils;

const {
  populateEnemies, enemyShot, enemyMovement, enemyCollisions, enemyGrabbed, enemySqueezed,
} = EnemyControllers;

const {
  populateFishes, moveFishes, replenishFishes, canEatFish,
} = FishControllers;

const playerBody = PlayerBody({ segments: 18, coords: [0, 0] });

const {
  squeeze, generateTentacleParts, iddleBody, accomodate, moveToAngle, turnTentacle, moveHead, bounceHead,
} = playerBody;

let mouseDown = false;
let grab = 0;
let havePower = true;
let shot;

class TentacleTest extends Phaser.Scene {
  constructor() {
    super({ key: 'TentacleTest' });
    this.count = 0;
    this.player = Player({ hp: 200, body: null });
    this.containers = [];
    this.submarine = false;
    this.divers = [];
    this.spears = [];
    this.fishes = [];
    this.over = false;
    this.tweens = null;
    this.id = 'KkMLF8BEl0nPVi9au6fA';
    this.level = 0;
    this.rayOn = false;
    this.frame = 0;
    this.clickDirection = 1;
    this.updateFrames = 0;
  }

  preload() {
    PreLoader.tentacle(this);
  }

  init(data) {
    this.name = data.name;
  }

  create() {
    const bgContainer = this.add.container(this.game.config.width, this.game.config.height).setName('conty');

    this.ts = this.add.tileSprite(-this.game.config.width / 2, -this.game.config.height / 2, this.game.config.width, this.game.config.height, 'mushroom').setName('tiley');
    this.ts.frameLength = 16;
    this.ts.currentFrame = 0;
    bgContainer.add(this.ts);

    this.gradientBgBottom = this.make.image({
      x: this.game.config.width / 2, y: this.game.config.height / 2, key: 'bottomGradient', add: true,
    });
    this.gradientBgTop = this.make.image({
      x: this.game.config.width / 2, y: this.game.config.height / 2, key: 'topGradient', add: true,
    });
    this.gradientBgBottom.setDepth(100);
    this.gradientBgTop.setDepth(0);

    this.head = this.make.image({
      x: this.game.config.width / 2, y: this.game.config.height / 1.5, key: 'head', add: true,
    });

    this.sfx = {
      bgm: this.sound.add('bgm', { loop: true }),
      bubble: this.sound.add('bubble'),
      eat: this.sound.add('eat'),
      push: this.sound.add('push'),
      ray: this.sound.add('ray'),
      rip: this.sound.add('rip'),
      shot: this.sound.add('shot'),
      gasp: this.sound.add('gasp'),
      submarine: this.sound.add('submarine'),
      breakSub: this.sound.add('breakSub'),
      rayStart: this.sound.add('rayStart'),
      subHug: this.sound.add('subHug'),
    };

    this.sfx.bgm.play();

    refreshStatus({ hp: true, score: true }, this);

    this.mainContainer = this.add.container(this.game.config.width / 2,
      this.game.config.height / 2);
    this.player.setBody(this.mainContainer);

    const playerTentacle = this.player.getBody();

    playerBody.setGoalX(playerTentacle.x);
    playerBody.setGoalY(playerTentacle.y);
    const image = this.make.image({
      x: playerTentacle.width / 2, y: playerTentacle.height / 2, key: 'logo', add: false,
    });

    playerTentacle.add(image);
    image.setScale(0.05);
    this.containers.push(playerTentacle);

    generateTentacleParts(this, image, playerTentacle, playerBody);

    this.playerSplats = this.add.group();

    populateFishes(this);

    this.input.on('pointermove', (e) => {
      this.player.setStill(false);

      moveHead(e, this);

      setTimeout(() => {
        playerBody.setAngle(0);
        this.player.setStill(true);
      }, 300);

      playerBody.setAngle(Math.cos(e.angle) / 8);

      turnTentacle(this.containers, playerBody, absSubstract);

      playerBody.setGoalX(e.position.x);
      playerBody.setGoalY(e.position.y);

      playerTentacle.x = playerBody.getGoalX();

      if (e.position.y >= 220) {
        playerTentacle.y = playerBody.getGoalY();
      }
    });

    Enemy({ type: 'plain', context: this }).add();

    this.input.on('pointerup', () => {
      mouseDown = false;
      grab = 0;
      havePower = false;

      setTimeout(() => {
        havePower = true;
      }, 1500);

      if (!playerBody.isCarrying()) {
        Bubble({ x: playerTentacle.x, y: this.sys.game.config.height, context: this }).add();
      }
    }, this);

    this.input.on('pointerdown', (e) => {
      mouseDown = true;
      if (this.game.config.width / 2 > e.downX) {
        this.clickDirection = -1;
      } else {
        this.clickDirection = 1;
      }
    });

    const myInt = setInterval(() => {
      bounceHead(this);

      if (playerBody.getGoalAngle() === 0) {
        iddleBody(playerTentacle);

        this.containers.forEach((container, i) => accomodate(this, container, i));
      } else if (this.player.isStill()) {
        moveToAngle(this, playerTentacle, playerBody);
      }

      if (this.divers.length > 0) {
        // eslint-disable-next-line no-unused-expressions
        !this.over && this.playerSplats.children.entries.forEach((splat) => {
          [...this.divers].forEach((diver, i) => enemyShot(this, playerBody, splat, diver, i));
        });
      }

      if (this.player.getHp() < 1 && !this.over) {
        endGame(this, myInt);
      }

      if (this.frame % 120 === 0) {
        populateEnemies(this);
      }

      // eslint-disable-next-line no-unused-expressions
      !this.over && this.divers.forEach((diver, i) => enemyCollisions(this,
        diver, i, playerBody, shot));

      this.divers = this.divers.filter((diver) => diver !== null);

      SpearControllers.moveSpears(this);

      this.spears = this.spears.filter((s) => s !== null);

      if (this.player.isStill() && this.player.getHp() + 0.05 <= 200) {
        this.player.incrementHp(0.05);
        refreshStatus({ hp: true }, this);
      }

      this.frame += 1;
    }, 1000 / 10);
  }

  update() {
    const calculateLevel = (num) => Math.floor(num / 500);

    this.level = calculateLevel(this.frame);
    if (!this.over) {
      animateBg(this, this.updateFrames);

      this.updateFrames += 1;
      // eslint-disable-next-line no-unused-expressions
      !this.over && this.playerSplats.children.entries.forEach((splat, i) => bubbleLife(splat, i));

      this.fishes = moveFishes(this.fishes, this, this.updateFrames);

      replenishFishes(this);

      [...this.divers].forEach((diver, i) => enemyMovement(this,
        diver, i, this.updateFrames, playerBody), this);

      this.divers = this.divers.filter((n) => n !== null);

      if (mouseDown && this.divers.length > 0 && this.containers[2].rotation >= 0.1) {
        const fallX = this.containers[2].localTransform.matrix[4];
        const fallY = this.containers[2].localTransform.matrix[5];
        this.divers.forEach((diver, i) => enemyGrabbed(diver, i, fallX, fallY, playerBody));
      }

      if (playerBody.isCarrying()) {
        playerBody.isCarrying().y = this.containers[2].localTransform.matrix[5] - 25;
        // eslint-disable-next-line prefer-destructuring
        playerBody.isCarrying().x = this.containers[2].localTransform.matrix[4];
      }

      if (havePower && mouseDown && grab < 0.04) {
        grab += 0.001;
        this.containers.forEach((container, i, arr) => squeeze(this,
          container, i, arr, shot, this.clickDirection, grab, canEatFish));
      }
    }
  }
}

export default TentacleTest;
