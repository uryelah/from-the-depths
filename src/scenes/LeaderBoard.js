/* eslint-disable import/no-unresolved */
import Phaser from 'phaser';

import Text from '../helpers/text';

const { addListText, addTitleText, addNoticeText } = Text;

class LeaderBoard extends Phaser.Scene {
  constructor() {
    super({ key: 'LeaderBoard' });
    this.data = {};
  }

  init(data) {
    this.id = data.id;
  }

  create() {
    this.title = addTitleText(this, 'Top scores', this.game.config.width * 0.2, 80, 'left');

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

        this.back = addNoticeText(this, '<<', 20, this.game.config.height - 40, 'left', '#ffffff');

        this.back.setInteractive();

        this.back.on('pointerup', () => {
          this.scene.start('SceneMainMenu');
        }, this);

        let userScoreArr = [];
        Object.keys(this.data).forEach((user) => {
          if (typeof this.data[user] === 'number') {
            userScoreArr.push([user, this.data[user]]);
          }
        });

        userScoreArr = userScoreArr.sort((a, b) => a[1] < b[1]);

        // eslint-disable-next-line array-callback-return
        userScoreArr.some((userScore, i) => {
          if (i > 14) {
            return;
          }

          addListText(this, 'left', 'green', `${userScore[0]}`, i, 0.2);
          addListText(this, 'left', '#ffffff', '---', i, 0.5, 'normal');
          addListText(this, 'left', 'green', `${userScore[1]}`, i, 0.75, 'normal');
        });
      })
      .catch((error) => {
        this.scene.start('SceneMainMenu');
        throw new Error(error);
      });
  }
}


export default LeaderBoard;
