/* eslint-disable import/no-unresolved */
import Phaser from 'phaser';

import Text from '../helpers/text';

import PreLoader from '../helpers/Preloader';

const { addSubtitle, addTitleText } = Text;

class SceneMainMenu extends Phaser.Scene {
  constructor() {
    super({ key: 'SceneMainMenu' });
    this.id = 'KkMLF8BEl0nPVi9au6fA';
    this.frame = 0;
  }

  preload() {
    PreLoader.mainMenu(this);
  }

  create() {
    this.bg = this.add.tileSprite(0, this.game.config.height - 270, 192, 108, 'water');
    this.bg.setOrigin(0, 0);
    this.bg.setDisplaySize(480, 270);

    this.sfx = {
      bubble: this.sound.add('bubble'),
      bgm: this.sound.add('bgm', { loop: true }),
    };

    this.sfx.bgm.play();

    this.leaderBtn = addSubtitle(this, 'center', '#ffffff', 'Leaderboard');

    this.leaderBtn.setOrigin(0.5, 0.5);

    this.leaderBtn.setDepth(10);

    this.leaderBtn.setInteractive();

    this.leaderBtn.on('pointerover', () => {
      this.sfx.bubble.play();
    }, this);

    this.leaderBtn.on('pointerup', () => {
      this.sfx.bubble.play();
      this.scene.start('LeaderBoard', { id: this.id });
    }, this);

    this.title = addTitleText(this, 'From the depths...');

    this.title.setOrigin(0.5);

    const text = this.add.text((this.game.config.width / 2) - 130, (this.game.config.height / 2) - 70, 'Please enter your name', { color: '#426e5d', fontSize: '20px ' });

    const element = this.add.dom(this.game.config.width / 2, this.game.config.height).createFromCache('nameform');

    element.addListener('click');

    element.on('click', (event) => {
      if (event.target.name === 'playButton') {
        const inputText = element.getChildByName('nameField');
        if (inputText.value !== '') {
          element.removeListener('click');
          element.setVisible(false);
          this.game.scene.stop('SceneMainMenu');
          this.game.scene.start('TentacleTest', { name: inputText.value });
        } else {
          this.scene.tweens.add({
            targets: text,
            alpha: 0.2,
            duration: 250,
            ease: 'Power3',
            yoyo: true,
          });
        }
      }
    });
    this.tweens.add({
      targets: element,
      y: 300,
      duration: 3000,
      ease: 'Power3',
    });
  }

  update() {
    this.frame += 1;

    if (this.frame % 100 < 10) {
      this.bg.setFrame(0);
    } else if (this.frame % 100 < 20) {
      this.bg.setFrame(1);
    } else if (this.frame % 100 < 30) {
      this.bg.setFrame(2);
    } else if (this.frame % 100 < 40) {
      this.bg.setFrame(3);
    } else if (this.frame % 100 < 50) {
      this.bg.setFrame(4);
    } else if (this.frame % 100 < 60) {
      this.bg.setFrame(5);
    } else if (this.frame % 100 < 70) {
      this.bg.setFrame(6);
    } else if (this.frame % 100 < 80) {
      this.bg.setFrame(7);
    } else if (this.frame % 100 < 90) {
      this.bg.setFrame(8);
    } else if (this.frame % 100 < 100) {
      this.bg.setFrame(9);
    }
  }
}

export default SceneMainMenu;
