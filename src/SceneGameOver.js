import Phaser from "phaser";

class SceneGameOver extends Phaser.Scene {
  constructor() {
    super({ key: "SceneGameOver" });
  }

  create() {
    this.btnRestart = this.add.sprite(
      this.game.config.width * 0.5,
      this.game.config.height * 0.5,
      "sprBtnRestart"
    );

    this.btnRestart.setInteractive();

    this.btnRestart.on("pointerover", function() {
      this.btnRestart.setTexture("sprBtnRestartHover"); // set the button texture to sprBtnPlayHover
      this.sfx.btnOver.play(); // play the button over sound
    }, this);

    this.btnRestart.on("pointerout", function() {
      this.setTexture("sprBtnRestart");
    });

    this.btnRestart.on("pointerdown", function() {
      this.btnRestart.setTexture("sprBtnRestartDown");
      this.sfx.btnDown.play();
    }, this);

    this.btnRestart.on("pointerup", function() {
      this.btnRestart.setTexture("sprBtnRestart");
      this.scene.start("SceneMain");
    }, this);
  }
};

export default SceneGameOver;