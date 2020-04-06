import Phaser from 'phaser';

import Text from '../helpers/text';

const { addTitleText, addSubtitle, addNoticeText } = Text;

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
    const rect = new Phaser.Geom.Rectangle(0, 0, this.game.config.width, this.game.config.height);
    graphics.fillRectShape(rect);

    this.title = addTitleText(this, 'GAME OVER', this.game.config.width * 0.5, 128, 'center', 48);

    this.title.setOrigin(0.5);

    this.restart = addSubtitle(this, 'center', '#ffffff', 'Restart');

    this.restart.setOrigin(0.5, 0.5);

    this.restart.setInteractive();

    this.restart.on('pointerdown', () => {
      this.game.scene.stop('SceneGameOver');
      window.location.reload();
    });

    this.playerScore = addNoticeText(this, `${this.name}'s score: ${this.score}`, this.game.config.width * 0.5, 208, 'center', 'red');

    this.playerScore.setOrigin(0.5);

    this.btnRestart.setInteractive();

    this.btnRestart.on('pointerover', () => {
      this.btnRestart.setTexture('sprBtnRestartHover');
      this.sfx.btnOver.play();
    }, this);

    this.btnRestart.on('pointerout', () => {
      this.setTexture('sprBtnRestart');
    });

    this.btnRestart.on('pointerdown', () => {
      this.btnRestart.setTexture('sprBtnRestartDown');
      this.sfx.btnDown.play();
    }, this);

    this.btnRestart.on('pointerup', () => {
      this.btnRestart.setTexture('sprBtnRestart');
      this.scene.start('SceneMain');
    }, this);
  }
}

export default SceneGameOver;
