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
let previousAngle = 0;
let inverseAngle = 0;
let goalX;
let goalY;
let acel = 1;
let mouseDown = false;
let splat;
let grab = 0;
let havePower = true;
let clickDirection;
let shot;
let rayOn = false;
let downer;
let carry = false;
let frame = 0;
let updateFrames = 0;
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
    this.player = { hp: 200, body: null };
    this.mainContainer;
    this.containers = [];
    this.pontuation = 0;
    this.score;
    this.submarine = false;
    this.divers = [];
    this.spears = [];
    this.still = false;
    this.fishes = [];
  }

  preload() {
    this.load.image('logo', './assets/seg.png');
    this.load.audio("bgm", "./assets/bgm.mp3");
    this.load.audio("bubble", "./assets/bubbleAttack.mp3");
    this.load.audio("eat", "./assets/eating.mp3");
    this.load.audio("push", "./assets/pushDiver.mp3");
    this.load.audio("ray", "./assets/rayZap.mp3");
    this.load.audio("rip", "./assets/ripDiver.mp3");
    this.load.audio("shot", "./assets/ripShot.mp3");
    this.load.audio("submarine", "./assets/subArrive.mp3");
    this.load.audio("rayStart", "./assets/subRayOn.mp3");
    this.load.audio("breakSub", "./assets/breakSub.mp3");
    this.load.audio("subHug", "./assets/dontHugTheSubmarine.mp3");
  }
  create() {
    this.sfx = {
      bgm: this.sound.add("bgm"),
      bubble: this.sound.add("bubble"),
      eat: this.sound.add("eat"),
      push: this.sound.add("push"),
      ray: this.sound.add("ray"),
      rip: this.sound.add("rip"),
      shot: this.sound.add("shot"),
      submarine: this.sound.add("submarine"),
      breakSub: this.sound.add("breakSub"),
      rayStart: this.sound.add("rayStart"),
      subHug: this.sound.add("subHug")
    };
    this.sfx.bgm.play();

    this.score = this.add.text(10, 20, `Points: ${this.pontuation}`, { fontFamily: '"Roboto Condensed"' }).setColor('red');
    this.hp = this.add.text(10, 40, `HP: ${this.player.hp.toFixed(2)}`, { fontFamily: '"Roboto Condensed"' }).setColor('green');
    this.mainContainer = this.add.container(game.config.width / 2, game.config.height / 2);
    this.player.body = this.mainContainer;
    goalX = this.mainContainer.x;
    goalY = this.mainContainer.y;
    const image = this.make.image({ x: this.mainContainer.width / 2, y: this.mainContainer.height / 2, key: 'logo', add: false });
    const image2 = this.make.image({ x: 1, y: 1, key: 'logo', add: false });
    const image3 = this.make.image({ x: 1, y: 1, key: 'logo', add: false });
    const image4 = this.make.image({ x: 1, y: 1, key: 'logo', add: false });
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
      let newImg = this.make.image({ x: 0, y: 0, key: 'logo', add: false });
      newImg.setScale((0.02 * (i + 0.5)) + 0.05);
      newImg.displayWidth = newImg.displayWidth - (i * 2)
      let newContainer = this.add.container(0, previousImg.displayHeight);
      newContainer.add(newImg);
      previousContainer.add(newContainer);
      previousContainer = newContainer;
      previousImg = newImg;
      this.containers.push(previousContainer);
      this.physics.world.enable(newContainer);
      newContainer.body.setOffset((-2.5 * i) - 15, (-2.5 * i) - 15);
      newContainer.body.setSize(newImg.displayWidth + 2, newImg.displayHeight + 2);
    }
    this.physics.world.enable(this.mainContainer);
    this.mainContainer.body.setCollideWorldBounds(true);
    this.mainContainer.body.setOffset(-10, -10);
    this.mainContainer.body.setSize(22, 20);
    this.playerSplats = this.add.group();

    // Make fishes for food
    let fish;
    let gravitaFish;
    for (let i = 0; i < 5; i += 1) {
      fish = this.make.image({ x: Math.random() * game.config.width, y: (Math.random() * (game.config.height - 200)) + 200, key: 'logo', add: false });
      fish.setScale(0.1);
      fish.direction = 1;
      this.physics.world.enable(fish);
      fish.body.setSize(100, 100);
      this.fishes.push(fish);
    }

    let moving = false;
    this.input.on('pointermove', e => {
      this.still = false;
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
        previousAngle = goalAngle;
        goalAngle = 0;
        this.still = true;
      }, 300)

      goalAngle = Math.cos(e.angle) / 8;
      if (previousAngle !== 0) {
        console.log('????', goalAngle, '!!!!', previousAngle);
      }
      inverseAngle = Math.cos(-e.angle);

      this.containers.forEach((container, i, arr) => {
        if (i < 18) {
          if (Math.abs(Math.abs(goalAngle) - Math.abs(previousAngle)) > 0.05
            && Math.abs(Math.abs(container.rotation) - Math.abs(previousAngle)) > 0.05) {
            if (i === 0) {
              if (container.rotation < (previousAngle * i)) {
                container.rotation += 0.1 - (i * 0.005);
              } else {
                container.rotation -= 0.1 - (i * 0.005);
              };
            } else {
              if (container.rotation < previousAngle) {
                container.rotation += 0.1 - (i * 0.005);
              } else {
                container.rotation -= 0.1 - (i * 0.005);
              };
            }
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

      if (e.position.y >= 220) {
        this.mainContainer.y = goalY;
      }
    });

    downer = this.add.sprite(this.mainContainer.x, 0, "logo");
    downer.setScale(0.09)
    downer.fall = true;
    downer.hp = 2;
    downer.smart = false;

    this.divers.push(downer);

    this.input.on('pointerup', e => {
      mouseDown = false;
      grab = 0;
      havePower = false;

      setTimeout(() => {
        havePower = true;
      }, 1500);

      if (!carry) {
        console.log(grab)
        let splatter = this.physics.add.sprite(this.mainContainer.x, this.sys.game.config.height, "logo");
        splatter.setScale(0.09)
        splatter.setGravityY(-200);
        this.playerSplats.add(splatter);
        this.sfx.bubble.play();
      }
    }, this);

    this.input.on('pointerdown', e => {
      mouseDown = true;
      if (game.config.width / 2 > e.downX) {
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
          if (this.still) {
            if (i === 0) {
              if (frame % 22 < 11) {
                container.x += 1;
              } else {
                container.x -= 1;
              }
            }
            if (i > 1 && i < 5) {
              if (frame % 22 < 11) {
                container.rotation -= 0.25 / (i * 10);
              } else {
                container.rotation += 0.25 / (i * 10);
              }
            } else if (i > 5 && i < 8){
              if (frame % 22 < 11) {
                container.rotation += 0.25 / (i * 10);
              } else {
                container.rotation -= 0.25 / (i * 10);
              }
            }
          }
          if (Math.abs(container.rotation) > 0.01) {
            if (container.rotation > 0) {
              container.rotation -= 0.01
            } else if (container.rotation < 0) {
              container.rotation += 0.01
            }
          }
        });
      } else if (!moving) {
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
            if (container.rotation < -goalAngle / (i)) {
              container.rotation += 0.1 - (i * 0.001);
            } else {
              container.rotation -= 0.1 - (i * 0.001);
            };
          }
        });
      }

      if (this.divers.length > 0) {
        this.playerSplats.children.entries.forEach((splat) => {
          this.divers.slice().forEach((diver, i) => {
            if (Math.abs(splat.x - diver.x) < 20 &&
              diver.y - splat.y > 2) {
              diver.hp -= 1;
              splat.destroy();

              if (diver.hp <= 0) {
                if (diver.type === 'submarine') {
                  this.submarine = false;
                  this.pontuation += 9;
                  diver.ray.destroy();
                  this.sfx.breakSub.play();
                }
                diver.destroy();
                this.divers.splice(i, 1);
                this.pontuation += 1;
                this.score.destroy();
                this.sfx.shot.play();
                this.score = this.add.text(10, 20, `Points: ${this.pontuation}`, { fontFamily: '"Roboto Condensed"' }).setColor('red');
                carry = null;
              }
            }
          });
        });
      }

      if (this.player.hp < 1) {
        this.scene.pause("TentacleTest");
        this.scene.remove("TentacleTest");
        this.scene.start("SceneGameOver");
        //this.player.destroy();
      }

      if (frame % 120 === 0) {
        for (let i = 0; i < 2; i += 1) {
          downer = this.add.sprite(Phaser.Math.Between(0, game.config.width), 0, "logo");
          downer.setScale(0.09);
          downer.fall = true;
          downer.hp = 2;
          downer.smart = false;
          this.divers.push(downer);
        }

        for (let i = 0; i < 1; i += 1) {
          downer = this.add.sprite(Phaser.Math.Between(0, game.config.width), 0, "logo");
          downer.setScale(0.09);
          downer.fall = true;
          downer.hp = 3;
          downer.smart = true;
          downer.shootClock = 10;
          this.divers.push(downer);
        }

        if (!this.submarine && Math.random() > 0.5) {
          this.submarine = true;
          downer = this.add.sprite(game.config.width / 2, 0, "logo");
          downer.setScale(0.18);
          downer.fall = true;
          downer.velocity = 0.2;
          downer.type = 'submarine';
          downer.timeToRay = 100;
          downer.hp = 20;
          downer.smart = false;
          downer.direction = 1;
          this.divers.push(downer);
          this.sfx.submarine.setLoop(true);
          this.sfx.submarine.play();
        }
      }

      this.divers.forEach((diver, i) => {
        if (diver.smart) {
          if (diver.shootClock === 0) {
            diver.shootClock = 20;
            let spear = this.add.sprite(diver.x, diver.y, "logo");
            spear.setScale(0.01);
            spear.velocity = { goal: [this.mainContainer.x, this.mainContainer.y], x: (this.mainContainer.x - diver.x) / 15, y: (this.mainContainer.y - diver.y) / 15 };

            this.spears.push(spear);
            this.physics.world.enable(spear);
            spear.body.setSize(100, 100);
            this.physics.add.collider(spear, this.mainContainer, () => {
              spear.destroy();
              this.spears.splice(this.spears.indexOf(spear), 1);
              this.player.hp -= 0.5;
              this.hp.destroy();
              this.hp = this.add.text(10, 40, `HP: ${this.player.hp.toFixed(2)}`, { fontFamily: '"Roboto Condensed"' }).setColor('green');
            }, null, this);
          }
          diver.shootClock -= 1;
        } else if (diver.type === 'submarine' && !diver.ray && diver.timeToRay <= 0) {
          let ray = this.add.sprite(diver.x, 0, "logo");
          ray.setScale(0.5);
          ray.setOrigin(0.5, 0);
          ray.displayWidth = ray.displayWidth * 0.3;
          ray.setVisible(false);
          this.physics.world.enable(ray);
          ray.body.setSize(game.config.height * 0.6, ray.displayWidth);
          diver.ray = ray;
        } else if (diver.type === 'submarine' && diver.ray && Math.abs(diver.x - game.config.width/2) < 30) {
          rayOn = true;
          diver.ray.setVisible(true);
          this.sfx.rayStart.play();
          diver.ray.x = diver.x;
          diver.ray.y = diver.y;
          diver.ray.displayHeight = game.config.height - diver.displayHeight - (diver.y/2);
          diver.ray.body.setSize(game.config.height * 0.6, diver.ray.displayHeight);

          let curColide = this.mainContainer;
          let colideCount = 0;

          while (curColide.list.length > 1 || colideCount < 10) {
            colideCount += 1;
            this.physics.add.collider(diver.ray, curColide, () => {
              if (rayOn) {
                this.player.hp -= 0.025;
                this.hp.destroy();
                this.hp = this.add.text(10, 40, `HP: ${this.player.hp.toFixed(2)}`, { fontFamily: '"Roboto Condensed"' }).setColor('green');
                this.sfx.ray.play();
              }
            }, null, this);
            curColide = curColide.list[1];
          }

        } else if (diver.type === 'submarine' && diver.ray && !Math.abs(diver.x - game.config.width/2) < 30) {
          diver.ray.setVisible(false);
          rayOn = false;
          this.sfx.ray.stop();
        } else if (diver.type === 'submarine') {
          diver.timeToRay -= 1;
        }
      });

      this.spears.forEach((spear, i) => {
        spear.y += spear.velocity.y;
        spear.x += spear.velocity.x;

        if (spear.x < 0 || spear.x > game.config.width || 
          spear.y < 0 || spear.y > game.config.height) {
          spear.destroy();
          this.spears[i] = null;
        }
      });

      this.spears = this.spears.filter(s => s !== null);

      if (this.still && this.player.hp + 0.05 <= 200) {
        this.player.hp += 0.05;
        this.hp.destroy();
        this.hp = this.add.text(10, 40, `HP: ${this.player.hp.toFixed(2)}`, { fontFamily: '"Roboto Condensed"' }).setColor('green');
      }

      frame += 1;
    }, 1000 / 10)

  }

  update() {
    // delete splats out of screen
    updateFrames += 1;
    this.playerSplats.children.entries.forEach((splat, i) => {
      if (splat.y < 0) {
        splat.destroy();
      }
    });

    // move fish
    [...this.fishes].forEach((fish, i) => {
      if (fish !== null) {
        fish.x += 0.5 * fish.direction;

        if (updateFrames % 48 * (i + 1) < 24 * (i + 1)) {
          fish.y -= 0.2;
        } else {
          fish.y += 0.2;
        }
      
        if (fish.x > game.config.width) {
          fish.x = -(Math.random() * 10);
          fish.y = (Math.random() * (game.config.width - 200)) + 200;
        }
      }
    });
    this.fishes = this.fishes.filter(n => n !== null);
    if (this.fishes.length < 5) {
      let fish = this.make.image({ x: -Math.random() * 50, y: (Math.random() * (game.config.height - 200)) + 200, key: 'logo', add: false });
      fish.setScale(0.1);
      fish.direction = 1;
      this.physics.world.enable(fish);
      fish.body.setSize(100, 100);
      this.fishes.push(fish);
    }

    [...this.divers].forEach((diver, i) => {
      if (diver !== null) {
        if (diver !== carry || (diver.type === 'submarine' && rayOn)) {
          diver.y += 1 * (diver.velocity ? diver.velocity : 1);
        } if (diver.y - diver.displayHeight > this.sys.game.config.height) {
          //diver.setVisible(false)
          //.setVisible(false)
          if (diver.type === 'submarine') {
            diver.ray.destroy();
            this.submarine = false;
            this.player.hp -= 10;
            this.sfx.submarine.setLoop(false);
            this.sfx.submarine.stop();
            this.hp.destroy();
            this.hp = this.add.text(10, 40, `HP: ${this.player.hp.toFixed(2)}`, { fontFamily: '"Roboto Condensed"' }).setColor('green');
          }
          diver.destroy();
          this.divers.splice(i, 1, null);
          this.hp.destroy();
          this.sfx.rip.play();
          this.hp = this.add.text(10, 40, `HP: ${this.player.hp.toFixed(2)}`, { fontFamily: '"Roboto Condensed"' }).setColor('green');
          this.player.hp -= 1;
        }
  
  
        if (diver.type === 'submarine') {
            diver.x += 0.5 * diver.direction;
    
            if (diver.x < 0 || diver.x > game.config.width) {
              diver.direction = -diver.direction;
            }
        } else if (diver.smart && Math.abs(diver.x - this.mainContainer.x) < 50
          && Math.abs(diver.y - this.mainContainer.y) < 50) {
          if (diver.y < this.mainContainer.y) {
            diver.y -= 5;
            diver.x -= 5;
          } else {
            diver.y += 5;
            diver.x += 5;
          }
          diver.shootClock = 0;
          this.sfx.push.play();
          diver.hp -= 0.05;
          this.player.hp -= 0.05;
          if (diver.hp < 0) {
            diver.destroy();
            this.divers.splice(i, 1, null);
            this.sfx.rip.play();
          }
        } else {
          if (Math.random() < 0.5) {
            diver.x -= 5;
          } else {
            diver.x += 5;
          }
        }
  
        if (diver.type !== 'submarine') {
          if (diver.x <= 0) {
            diver.x += 25
          } else if (diver.x >= game.config.width) {
            diver.x -= 25
          }
        }
      }
    }, this);

    this.divers = this.divers.filter(n => n !== null)


    if (mouseDown && this.divers.length > 0 && this.containers[2].rotation >= 0.1) {
      let fallX = this.containers[2].localTransform.matrix[4];
      let fallY = this.containers[2].localTransform.matrix[5];
      this.divers.forEach((diver, i) => {
        if (diver.type !== 'submarine' && fallY - diver.y < 50 &&
          Math.abs(fallX - diver.x) < 50) {
          diver.fall = false;
          carry = diver;
          carry.id = i;
        }
      });
    }

    if (carry) {
      carry.y = this.containers[2].localTransform.matrix[5] - 25;
      carry.x = this.containers[2].localTransform.matrix[4];
    }

    if (havePower && mouseDown && grab < 0.04) {
      grab += 0.001;
      if (true) {
        this.containers.forEach((container, i, arr) => {
          if (i === 2 && Math.abs(container.rotation) > 1.1) {
            if (carry) {
              carry.destroy();
              this.divers.splice(carry.id, 1)
              console.log('killed');
              this.pontuation += 1;
              this.score.destroy();
              this.score = this.add.text(10, 20, `Points: ${this.pontuation}`, { fontFamily: '"Roboto Condensed"' }).setColor('red');
              carry = false;
              shot = false;
            } else {
              this.divers.slice().forEach((diver, i) => {
                if (diver !== null) {
                  if (Math.abs(arr[0].y - diver.y) < 40 && Math.abs(arr[0].x - diver.x) < 50) {
                    if (diver.type === 'submarine') {
                      this.player.hp -= 5;
                      this.hp.destroy();
                      this.sfx.subHug.play();
                      setTimeout(() => {
                        this.sfx.subHug.stop();
                      }, 3000);
                      this.hp = this.add.text(10, 40, `HP: ${this.player.hp.toFixed(2)}`, { fontFamily: '"Roboto Condensed"' }).setColor('green');
                    } else {
                      console.log('on reach');
                      diver.destroy();
                      this.divers.splice(i, 1, null);
                      this.pontuation += 1;
                      this.score.destroy();
                      this.sfx.rip.play();
                      this.score = this.add.text(10, 20, `Points: ${this.pontuation}`, { fontFamily: '"Roboto Condensed"' }).setColor('red');
                      shot = false;
                      console.log('killed');
                    }
                  }
                }
              });
              [...this.fishes].forEach((fish, i) => {
                if (Math.abs(arr[0].y - fish.y) < 30 && Math.abs(arr[0].x - fish.x) < 30) {
                  console.log('NHAM NHAM...');
                  this.sfx.eat.play();
                  fish.destroy();
                  this.fishes.splice(i, 1, null);
                  this.player.hp += 1;
                  this.hp.destroy();
                  this.hp = this.add.text(10, 40, `HP: ${this.player.hp.toFixed(2)}`, { fontFamily: '"Roboto Condensed"' }).setColor('green');
                }
              });
            }
          }
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
              container.rotation += grab / 1.8;
            } else {
              container.rotation -= grab / 1.8;
            }
          }
        });
      }
    }
  }
}

export default TentacleTest;
