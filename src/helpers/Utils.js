/* eslint-disable no-param-reassign */
const Utils = (() => ({
  absSubstract: (a, b) => Math.abs(Math.abs(a) - Math.abs(b)),

  animateBg: (context, frames) => {
    if (frames % 20 === 0) {
      if (context.ts.currentFrame + 1 < context.ts.frameLength) {
        context.ts.setFrame(context.ts.currentFrame + 1);
        context.ts.currentFrame += 1;
      } else {
        context.ts.setFrame(0);
        context.ts.currentFrame = 0;
      }
    }
  },

  refreshStatus: (type = { score: true, hp: true }, element) => {
    const { score, hp } = type;

    if (score) {
      if (element.score) {
        element.score.destroy();
      }
      element.score = element.add.text(10, 20, `Points: ${element.player.getScore()}`, { fontFamily: '"Roboto Condensed"' }).setColor('red');
    }

    if (hp) {
      if (element.hp) {
        element.hp.destroy();
      }
      element.hp = element.add.text(10, 40, `HP: ${element.player.getHp().toFixed(2)}`, { fontFamily: '"Roboto Condensed"' }).setColor('yellow');
    }
  },

  endGame: (context, interval) => {
    clearInterval(interval);
    context.over = true;
    context.sfx.bgm.stop();
    context.game.scene.stop('TentacleTest');
    context.game.scene.start('SceneGameOver', { score: context.player.getScore(), name: context.name });

    fetch(`https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/${context.id}/scores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: context.name,
        score: context.player.getScore(),
      }),
    })
      .then(data => data.json()).then(res => res.result)
      .catch((error) => {
        throw new Error(error);
      });
  },
}))();

export default Utils;
