import { ScrollingBackground } from './Entities';
import game from './index';

class SceneMainMenu extends Phaser.Scene {
  constructor() {
    super({ key: "SceneMainMenu" });
    this.id = "KkMLF8BEl0nPVi9au6fA";
  }

  preload() {
    this.load.image("sprBg0", "./assets/sprBg0.png");
    this.load.image("sprBg1", "./assets/sprBg1.png");
    this.load.image("sprBtnPlay", "./assets/sprBtnPlay.png");
    this.load.image("sprBtnPlayHover", "./assets/sprBtnPlayHover.png");
    this.load.image("sprBtnPlayDown", "./assets/sprBtnPlayDown.png");
    this.load.image("sprBtnRestart", "./assets/sprBtnRestart.png");
    this.load.image("sprBtnRestartHover", "./assets/sprBtnRestartHover.png");
    this.load.image("sprBtnRestartDown", "./assets/sprBtnRestartDown.png");
    this.load.audio("sndBtnOver", "./assets/sndBtnOver.wav");
    this.load.audio("sndBtnDown", "./assets/sndBtnDown.wav");
    this.load.html('nameform', './assets/dom/nameform.html');
  }

  create() {
    this.sfx = {
      btnOver: this.sound.add("sndBtnOver"),
      btnDown: this.sound.add("sndBtnDown")
    };

    this.btnPlay = this.add.sprite(
      this.game.config.width * 0.5,
      this.game.config.height - 20,
      "sprBtnPlay"
    );

    this.btnPlay.setInteractive();

    this.btnPlay.on("pointerover", function () {
      this.btnPlay.setTexture("sprBtnPlayHover"); // set the button texture to sprBtnPlayHover
      this.sfx.btnOver.play(); // play the button over sound
    }, this);

    this.btnPlay.on("pointerout", function () {
      this.setTexture("sprBtnPlay");
    });

    this.btnPlay.on("pointerdown", function () {
      this.btnPlay.setTexture("sprBtnPlayDown");
      this.sfx.btnDown.play();
    }, this);

    this.btnPlay.on("pointerup", function () {
      this.btnPlay.setTexture("sprBtnPlay");
      this.scene.start("LeaderBoard", { id: this.id });
    }, this);

/*
    this.btnPlay = this.add.sprite(
      this.game.config.width * 0.5,
      this.game.config.height * 0.5,
      "sprBtnPlay"
    );
*/
    //this.btnPlay.setInteractive();

    this.title = this.add.text(this.game.config.width * 0.5, 128, "From the depths...", {
      fontFamily: 'monospace',
      fontSize: 40,
      fontStyle: 'bold',
      color: '#ffffff',
      align: 'center'
    });
    this.title.setOrigin(0.5);

    var text = this.add.text((game.config.width/2) - 130, (game.config.height/2) - 60, 'Please enter your name', { color: 'white', fontSize: '20px ' });

    var element = this.add.dom(game.config.width/2, game.config.height).createFromCache('nameform');
    console.log(element)

    element.addListener('click');

    element.on('click', function (event) {

      if (event.target.name === 'playButton') {
        var inputText = this.getChildByName('nameField');

        //  Have they entered anything?
        if (inputText.value !== '') {
          //  Turn off the click events
          this.removeListener('click');

          //  Hide the login element
          this.setVisible(false);

          //  Populate the text with whatever they typed in
          game.scene.start("TentacleTest", { name: inputText.value });
        } else {
          //  Flash the prompt
          this.scene.tweens.add({
            targets: text,
            alpha: 0.2,
            duration: 250,
            ease: 'Power3',
            yoyo: true
          });
        }
      }

    });
    this.tweens.add({
      targets: element,
      y: 300,
      duration: 3000,
      ease: 'Power3'
    });
    this.backgrounds = [];
    for (var i = 0; i < 5; i++) {
      var keys = ["sprBg0", "sprBg1"];
      var key = keys[Phaser.Math.Between(0, keys.length - 1)];
      var bg = new ScrollingBackground(this, key, i * 10);
      this.backgrounds.push(bg);
    }
  }

  update() {
    for (var i = 0; i < this.backgrounds.length; i++) {
      this.backgrounds[i].update();
    }
  }
}

export default SceneMainMenu;
