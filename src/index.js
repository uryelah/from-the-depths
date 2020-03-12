import Phaser from "phaser";
//Scenes
import SceneMain from './SceneMain';
import SceneGameOver from './SceneGameOver';
import SceneMainMenu from './SceneMainMenu';
import ScenePreMenu from './ScenePreMenu';
import TentacleTest from './TentacleTest';
import LeaderBoard from './LeaderBoard';
import { Player } from './Entities';

window.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
  }
}, false);

const config = {
  type: Phaser.WEBGL,
  parent: "phaser-example",
  width: 480,
  height: 640,
  backgroundColor: "#000000",
  parent: "divId",
  dom: {
      createContainer: true
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      gravity: { x: 0, y: 0 },
      fps: 30
    }
  },
  scene: [
    SceneMainMenu,
    //SceneMain,
    TentacleTest,
    SceneGameOver,
    LeaderBoard
  ],
  pixelArt: true,
  roundPixels: true
};

const game = new Phaser.Game(config);

export default game;
