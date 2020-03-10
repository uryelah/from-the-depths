import Phaser from "phaser";
import { Player } from "./Entities";
import game from './index';
let line;
let line2;
let line3;
let line4;
let width;
let graphics;
let velocity = 0;
class TentacleTest extends Phaser.Scene {
  constructor() {
    super({ key: "TentacleTest" });
    //this.line = new Phaser.Geom.Line(this.start[0]/2, this.start[1]/2, this.start[0]/2 + 100, this.start[1]/2 - 100);
    this.count = 0;
    this.tween;
  }

  preload() {
  }
  create() {
    //  width: 480,
    //  height: 640,
    //this.line = new Phaser.Geom.Line(this.start[0]/2, this.start[1]/2, this.start[0]/2 + 100, this.start[1]/2 - 100);
    width = Math.sqrt(50**50, 50**50);
    graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xaa00aa } });

    line = new Phaser.Geom.Line(300, 300, 350, 250);
    line2 = new Phaser.Geom.Line(300, 800, 300, 300);
    line3 = new Phaser.Geom.Line(300, 1000, 300, 800);
    line4 = new Phaser.Geom.Line(300, 1200, 300, 1000);

    this.input.on('pointerup', function (event) {
      this.count += 10;
      console.log(event);

    }, this);

    this.input.on('pointermove', e => {
      //console.log(e);
      //line.setTo(300, 300, 350, 350);
      //console.log(e);
      let prev = [];
      let dx = e.position.x - Math.abs(line.x1);
      let dy = e.position.y - Math.abs(line.y1);
      let result = Math.atan2(dy, dx);
      let result2 = Math.atan2(dy - 50, dx - 50);
      
      let directionY = e.prevPosition.y - e.position.y;
      let directionX = e.prevPosition.x - e.position.x;
      let distance = Math.sqrt(((e.position.x - line.x2)**2) + ((e.position.y - line.y2)**2));

      velocity += 3;

      let newXa = 0;
      let newYa = 0;
      newXa = directionX < 0 ? line.x2 + (Math.min(Math.max(directionX * velocity, -50), -10)) : line.x2 + (Math.max(Math.min(directionX * velocity, 50), 10));
      newYa = directionY < 0 ? line.y2 + (Math.min(Math.max(directionY * velocity, -50), -10)) : line.y2 + (Math.max(Math.min(directionY * velocity, 50), 10));

      //line.setTo(line.x2, line.y2, e.position.x, e.position.y);
      line.setOrigin(0, 0)
      //line2.setTo(line3.x2, line3.x2,line.x1, line.y1);
      //line3.setTo(line4.x2, line4.x2,line2.x1, line2.y1);
      //line4.setTo(line4.x1, line4.y1, line3.x1, line3.y1);
    });

    setInterval(() => {
      if (velocity > 1) {
        velocity -= 1;
      }
    }, 1000/50)
  }

  update() {
    //Phaser.Geom.Line.Rotate(line, 0.02);
    graphics.clear();

    graphics.strokeLineShape(line);
    graphics.strokeLineShape(line2);
    graphics.strokeLineShape(line3);
    //graphics.strokeLineShape(line4);

    graphics.fillStyle(0xaa0000);

    graphics.fillStyle(0x0000aa);
  }
}

export default TentacleTest;
  