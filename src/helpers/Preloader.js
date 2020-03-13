const PreLoader = (() => {
  return {
    tentacle: (scene) => {
      scene.load.image('bottomGradient', './assets/bg-gradient.png');
      scene.load.image('head', './assets/head.png');
      scene.load.image('submarine', './assets/submarine.png');
      scene.load.image('ray', './assets/ray.png');
      scene.load.image('topGradient', './assets/bg-top-gradient.png');
      scene.load.image('logo', './assets/nuSeg.png');
      scene.load.image('vaquita', './assets/vaquita.png');
      scene.load.image('sprBtnPlay', './assets/sprBtnPlay.png');
      scene.load.audio('bgm', './assets/bgm.mp3');
      scene.load.audio('bubble', './assets/bubbleAttack.mp3');
      scene.load.audio('eat', './assets/eating.mp3');
      scene.load.audio('push', './assets/pushDiver.mp3');
      scene.load.audio('ray', './assets/rayZap.mp3');
      scene.load.audio('rip', './assets/ripDiver.mp3');
      scene.load.audio('gasp', './assets/gasp.mp3');
      scene.load.audio('shot', './assets/ripShot.mp3');
      scene.load.audio('submarine', './assets/subArrive.mp3');
      scene.load.audio('rayStart', './assets/subRayOn.mp3');
      scene.load.audio('breakSub', './assets/breakSub.mp3');
      scene.load.audio('subHug', './assets/dontHugTheSubmarine.mp3');
      scene.load.spritesheet('mushroom', './assets/ocean.png', {
        frameWidth: 32,
        frameHeight: 32,
      });
      scene.load.spritesheet('shot', './assets/shot.png', {
        frameWidth: 16,
        frameHeight: 16,
      });
      scene.load.spritesheet('fish', './assets/vaquita.png', {
        frameWidth: 32,
        frameHeight: 32,
      });
      scene.load.spritesheet('diver', './assets/diver01.png', {
        frameWidth: 32,
        frameHeight: 32,
      });
      scene.load.spritesheet('diverSmart', './assets/diver02.png', {
        frameWidth: 32,
        frameHeight: 32,
      });
      scene.load.spritesheet('bubble', './assets/bubble.png', {
        frameWidth: 32,
        frameHeight: 32,
      });
    },

    mainMenu: (scene) => {
      scene.load.spritesheet('water', './assets/water.png', {
        frameWidth: 192,
        frameHeight: 108,
      });
      scene.load.audio('bgm', './assets/bgm.mp3');
      scene.load.audio('bubble', './assets/bubbleAttack.mp3');
      scene.load.html('nameform', './assets/dom/nameform.html');
    }
  }
})();

export default PreLoader;