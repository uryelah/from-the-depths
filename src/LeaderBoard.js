import Phaser from "phaser";
import game from './index';

class LeaderBoard extends Phaser.Scene {
  constructor() {
    super({ key: "LeaderBoard" });
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
        "Content-Type": "application/json"
      }
    })
      .then(data => data.json()).then(res => {
        res.result.forEach(obj => {
          if (this.data[obj.user]) {
            this.data[obj.user] = Math.max(this.data[obj.user], obj.score);
          } else {
            this.data[obj.user] = obj.score;
          }
        });

        this.title = this.add.text((this.game.config.width * 0.2), 80, 'Leader Board', {
          fontFamily: 'monospace',
          fontSize: 40,
          fontStyle: 'bold',
          color: '#ffffff',
          align: 'left'
        });

        let userScoreArr = [];
        for (let user in this.data) {
          if (typeof this.data[user] === 'number') {
            userScoreArr.push([user, this.data[user]]);
          }
        }

        userScoreArr = userScoreArr.sort((a, b) => a[1] < b[1]);

        userScoreArr.forEach((userScore, i) => {
          this.add.text((this.game.config.width * 0.2), 170 + (25 * i), `${userScore[0]}`, {
            fontFamily: 'monospace',
            fontSize: 20,
            fontStyle: 'bold',
            color: 'green',
            align: 'left'
          });

          this.add.text((this.game.config.width * 0.5), 175 + (25 * i), `---`, {
            fontFamily: 'monospace',
            fontSize: 20,
            fontStyle: 'normal',
            color: '#ffffff',
            align: 'center'
          });

          this.add.text((this.game.config.width * 0.75), 170 + (25 * i), `${userScore[1]}`, {
            fontFamily: 'monospace',
            fontSize: 20,
            fontStyle: 'normal',
            color: 'green',
            align: 'right'
          });
        });
      })
      .catch(function (error) {
        console.log('Request failure: ', error);
      });
  }
};


export default LeaderBoard;