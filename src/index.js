import Phaser from "phaser";
//Scenes
import SceneMain from './SceneMain';
import SceneGameOver from './SceneGameOver';
import SceneMainMenu from './SceneMainMenu';
import ScenePreMenu from './ScenePreMenu';
import TentacleTest from './TentacleTest';
import { Player } from './Entities';

const config = {
  type: Phaser.WEBGL,
  parent: "phaser-example",
  width: 480,
  height: 640,
  backgroundColor: "#000000",
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      gravity: { x: 0, y: 0 },
      fps: 30
    }
  },
  scene: [
    //SceneMainMenu,
    //SceneMain,
    //SceneGameOver
    TentacleTest
  ],
  pixelArt: true,
  roundPixels: true
};

const game = new Phaser.Game(config);

export default game;
