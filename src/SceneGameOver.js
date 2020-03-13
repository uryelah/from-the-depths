import Phaser from 'phaser';
import game from './index';

class SceneGameOver extends Phaser.Scene {
  constructor() {
    super({ key: 'SceneGameOver' });
  }

  init(data) {
    this.name = data.name;
    this.score = data.score;
  }

  create() {
    this.btnRestart = this.add.sprite(
      this.game.config.width * 0.5,
      this.game.config.height * 0.5,
      'sprBtnRestart',
    );
    const graphics = this.add.graphics({ fillStyle: { color: 0x000000 } });
    const rect = new Phaser.Geom.Rectangle(0, 0, game.config.width, game.config.height);
    graphics.fillRectShape(rect);

    this.title = this.add.text(this.game.config.width * 0.5, 128, 'GAME OVER', {
      fontFamily: 'monospace',
      fontSize: 48,
      fontStyle: 'bold',
      color: '#ffffff',
      align: 'center',
    });
    this.title.setOrigin(0.5);

    this.restart = this.add.text(this.game.config.width * 0.5, game.config.height - 60, 'Restart', {
      fontFamily: 'monospace',
      fontSize: 24,
      fontStyle: 'bold',
      color: 'white',
      align: 'center',
    });

    this.restart.setOrigin(0.5, 0.5);

    this.restart.setInteractive();

    this.restart.on('pointerdown', () => {
      //game.scene.stop('SceneGameOver'); 
      window.location.reload();
      //game.scene.start('SceneMainMenu');
    });

    this.playerScore = this.add.text(this.game.config.width * 0.5, 208, `${this.name}'s score: ${this.score}`, {
      fontFamily: 'monospace',
      fontSize: 30,
      fontStyle: 'normal',
      color: 'red',
      align: 'center',
    });
    this.playerScore.setOrigin(0.5);

    this.btnRestart.setInteractive();

    this.btnRestart.on('pointerover', function () {
      this.btnRestart.setTexture('sprBtnRestartHover'); // set the button texture to sprBtnPlayHover
      this.sfx.btnOver.play(); // play the button over sound
    }, this);

    this.btnRestart.on('pointerout', function () {
      this.setTexture('sprBtnRestart');
    });

    this.btnRestart.on('pointerdown', function () {
      this.btnRestart.setTexture('sprBtnRestartDown');
      this.sfx.btnDown.play();
    }, this);

    this.btnRestart.on('pointerup', function () {
      this.btnRestart.setTexture('sprBtnRestart');
      this.scene.start('SceneMain');
    }, this);
  }
}

export default SceneGameOver;
