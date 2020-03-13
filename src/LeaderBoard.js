import Phaser from 'phaser';

class LeaderBoard extends Phaser.Scene {
  constructor() {
    super({ key: 'LeaderBoard' });
    this.data = {};
  }

  init(data) {
    this.id = data.id;
  }

  create() {
    console.log(this.id);
    fetch(`https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/${this.id}/scores`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((data) => data.json()).then((res) => {
        res.result.forEach((obj) => {
          if (this.data[obj.user]) {
            this.data[obj.user] = Math.max(this.data[obj.user], obj.score);
          } else {
            this.data[obj.user] = obj.score;
          }
        });

        this.title = this.add.text((this.game.config.width * 0.2), 80, 'Top scores', {
          fontFamily: 'monospace',
          fontSize: 40,
          fontStyle: 'bold',
          color: '#ffffff',
          align: 'left',
        });

        this.back = this.add.text(20, this.game.config.height - 40, '<<', {
          fontFamily: 'monospace',
          fontSize: 30,
          fontStyle: 'bold',
          color: '#ffffff',
          align: 'left',
        });

        this.back.setInteractive();

        this.back.on('pointerup', function () {
          this.scene.start('SceneMainMenu');
        }, this);

        let userScoreArr = [];
        Object.keys(this.data).forEach((user) => {
          if (typeof this.data[user] === 'number') {
            userScoreArr.push([user, this.data[user]]);
          }
        });

        userScoreArr = userScoreArr.sort((a, b) => a[1] < b[1]);

        userScoreArr.some((userScore, i) => {
          if (i > 14) {
            return;
          }
          this.add.text((this.game.config.width * 0.2), 170 + (25 * i), `${userScore[0]}`, {
            fontFamily: 'monospace',
            fontSize: 20,
            fontStyle: 'bold',
            color: 'green',
            align: 'left',
          });

          this.add.text((this.game.config.width * 0.5), 175 + (25 * i), '---', {
            fontFamily: 'monospace',
            fontSize: 20,
            fontStyle: 'normal',
            color: '#ffffff',
            align: 'center',
          });

          this.add.text((this.game.config.width * 0.75), 170 + (25 * i), `${userScore[1]}`, {
            fontFamily: 'monospace',
            fontSize: 20,
            fontStyle: 'normal',
            color: 'green',
            align: 'right',
          });
        });
      })
      .catch((error) => {
        console.log('Request failure: ', error);
      });
  }
}


export default LeaderBoard;
