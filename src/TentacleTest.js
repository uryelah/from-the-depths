import Phaser from "phaser";
import { Player } from "./Entities";
import Entity from './Entity';
import game from './index';
let line;
let line2;
let line3;
let line4;
let width;
let graphics;
let velocity = 0;
let goalAngle = 0;
let inverseAngle = 0;
let goalX;
let goalY;
let acel = 1;
let mouseDown = false;
let splat;
let grab = 0;
let havePower = true;
let clickDirection;
class PlayerSplat {
  constructor(x, y, sprite) {
    this.x = x;
    this.y = y;
  }
}

class TentacleTest extends Phaser.Scene {
  constructor() {
    super({ key: "TentacleTest" });
    //this.line = new Phaser.Geom.Line(this.start[0]/2, this.start[1]/2, this.start[0]/2 + 100, this.start[1]/2 - 100);
    this.count = 0;
    this.tween;
    this.mainContainer;
    this.containers = [];
  }

  preload() {
    this.load.image('logo', './assets/seg.png');
  }
  create() {
    this.mainContainer = this.add.container(game.config.width / 2, game.config.height / 2);
    goalX = this.mainContainer.x;
    goalY = this.mainContainer.y;
    const image = this.make.image({x: this.mainContainer.width/2, y: this.mainContainer.height/2, key: 'logo', add: false});
    const image2 = this.make.image({x: 1, y: 1, key: 'logo', add: false});
    const image3 = this.make.image({x: 1, y: 1, key: 'logo', add: false});
    const image4 = this.make.image({x: 1, y: 1, key: 'logo', add: false});
    const container1 = this.add.container(0, image.height * 0.23);
    const container2 = this.add.container(0, image2.height * 0.32);
    const container3 = this.add.container(0, image4.height * 0.43);
    this.mainContainer.add(image);
    image.setScale(0.05)
    //this.mainContainer.add(container1);
    this.containers.push(this.mainContainer);

    let previousContainer = this.mainContainer;
    let previousImg = image;
    for (let i = 0; i < 18; i++) {
      let newImg = this.make.image({x: 0, y: 0, key: 'logo', add: false});
      newImg.setScale((0.02 * (i + 0.5)) + 0.05);
      newImg.displayWidth = newImg.displayWidth - (i * 2)
      let newContainer = this.add.container(0, previousImg.displayHeight);
      newContainer.add(newImg);
      previousContainer.add(newContainer);
      previousContainer = newContainer;
      previousImg = newImg;
      this.containers.push(previousContainer);
    }


    this.playerSplats = this.add.group();

    let moving = false;
    this.input.on('pointermove', e => {
      moving = true;
      if (acel === 1) {
        acel += 1;
      } else {
        acel += 0.5;
      }
      setTimeout(() => {
        moving = false;
      }, 100)
      setTimeout(() => {
        goalAngle = 0;
      }, 300)

      goalAngle = Math.cos(e.angle)/8;
      inverseAngle = Math.cos(-e.angle);

      this.containers.forEach((container, i, arr) => {
        if (i < 18) {
          if (i === 0) {
            if (container.rotation < goalAngle * i) {
              container.rotation += 0.1 - (i * 0.005);
            } else {
              container.rotation -= 0.1 - (i * 0.005);
            };
          } else {
            if (container.rotation < goalAngle) {
              container.rotation += 0.1 - (i * 0.005);
            } else {
              container.rotation -= 0.1 - (i * 0.005);
            };
          }
        } else {
          if (container.rotation < -goalAngle) {
            container.rotation -= 0.07;
          } else {
            container.rotation += 0.07;
          };
        }
      });

      goalX = e.position.x;
      goalY = e.position.y;

      this.mainContainer.x = goalX;

      if(e.position.y >= 220) {
        this.mainContainer.y = goalY;
      }
    });

    this.input.on('pointerup', e => {
      mouseDown = false;
      grab = 0;
      havePower = false;

      setTimeout(() => {
        havePower = true;
      }, 3000);

      let splatter = this.physics.add.sprite(this.mainContainer.x,this.sys.game.config.height,"logo");
      splatter.setScale(0.09)
      splatter.setGravityY(-200);
      this.playerSplats.add(splatter);
      splatter.setImmovable(true);
      let downer = this.physics.add.sprite(this.mainContainer.x,0,"logo");
      downer.setScale(0.09)
      downer.setGravityY(100);
      downer.body.setImmovable(true);
      this.physics.add.collider(splatter, downer, () => {
        splatter.setGravityY(-100)
        downer.destroy();
      }, null, this);
    }, this);

    this.input.on('pointerdown', e => {
      mouseDown = true;
      if (game.config.width/2 > e.downX) {
        clickDirection = -1;
      } else {
        clickDirection = 1;
      }
    });

    const myInt = setInterval(() => {

    if (goalAngle === 0) {
      if (Math.abs(this.mainContainer.rotation) > 0.05) {
        if (this.mainContainer.rotation > 0) {
          this.mainContainer.rotation -= 0.025
        } else if (this.mainContainer.rotation < 0) {
          this.mainContainer.rotation += 0.025
        } 
      }

      this.containers.forEach((container, i) => {
          if (Math.abs(container.rotation) > 0.01) {
            if (container.rotation > 0) {
              container.rotation -= 0.01
            } else if (container.rotation < 0) {
              container.rotation += 0.01
            }
          }
      });
    } else if (!moving) {
      console.log('here')
      if (this.mainContainer.rotation < goalAngle) {
        this.mainContainer.rotation += 0.1;
      } else {
        this.mainContainer.rotation -= 0.1;
      };

      this.containers.forEach((container, i, arr) => {
        if (i < 18) {
          if (container.rotation < goalAngle / i) {
            container.rotation += 0.1 - (i * 0.005);
          } else {
            container.rotation -= 0.1 - (i * 0.005);
          };  
        } else {
          if (container.rotation < -goalAngle/(i)) {
            container.rotation += 0.1 - (i * 0.001);
          } else {
            container.rotation -= 0.1 - (i * 0.001);
          };  
        }
      });
 
    }
/*
    while (Math.abs(Math.abs(this.mainContainer.rotation) - Math.abs(goalAngle)) > 0.05) {
      console.log(this.mainContainer.rotation)
      if (this.mainContainer.rotation < goalAngle) {
        this.mainContainer.rotation += 0.005;
      } else {
        this.mainContainer.rotation -= 0.005;
      }
    }
*/
    }, 1000/10)

  }

  update() {
    // delete splats out of screen
    this.playerSplats.children.entries.forEach((splat) => {
      if (splat.y < 0) {
        splat.destroy();
      }
    });

    if (havePower && mouseDown && grab < 0.04) {
      grab += 0.001;
      console.log(grab)
      this.containers.forEach((container, i) => {
        if (i < 5) {
          if (clickDirection < 0) {
            container.rotation -= grab * (2);
          } else {
            container.rotation += grab * (2);
          }
          //container.displayHeight += grab;
        } else if (i < 9) {
          if (clickDirection < 0) {
            container.rotation += 2 * grab;
          } else {
            container.rotation -= 2 * grab;
          }
        } else {
          if (clickDirection < 0) {
            container.rotation += grab/1.8;
          } else {
            container.rotation -= grab/1.8;
          }
        }
      });
    }
  }
}

export default TentacleTest;
  