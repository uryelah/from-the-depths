import Phaser from 'phaser';

import SceneGameOver from './scenes/SceneGameOver';

import SceneMainMenu from './scenes/SceneMainMenu';

import TentacleTest from './TentacleTest';

import LeaderBoard from './scenes/LeaderBoard';
import cleanKeyPress from './helpers/dom';

cleanKeyPress();

const config = {
  type: Phaser.WEBGL,
  width: 480,
  height: 640,
  backgroundColor: '#000000',
  parent: 'divId',
  dom: {
    createContainer: true,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { x: 0, y: 0 },
      fps: 30,
    },
  },
  scene: [
    SceneMainMenu,
    TentacleTest,
    SceneGameOver,
    LeaderBoard,
  ],
  pixelArt: true,
  roundPixels: true,
};

const game = new Phaser.Game(config);

export default game;
