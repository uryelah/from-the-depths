import Phaser from 'phaser';
import SceneGameOver from './SceneGameOver';
import SceneMainMenu from './SceneMainMenu';
import TentacleTest from './TentacleTest';
import LeaderBoard from './LeaderBoard';

window.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
  }
}, false);

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
