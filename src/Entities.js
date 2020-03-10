import SceneGameOver from './SceneGameOver'
import Entity from './Entity';

class Player extends Entity {
  constructor(scene, x, y, key) {
    super(scene, x, y, key, "Player");

    this.setData("speed", 200);
    //this.play("sprPlayer");
    this.setData("isShooting", false);
    this.setData("timerShootDelay", 10);
    this.setData("timerShootTick", this.getData("timerShootDelay") - 1);
  }

  moveUp() {
    this.body.velocity.y = -this.getData("speed");
  }
  
  moveDown() {
    this.body.velocity.y = this.getData("speed");
  }
  
  moveLeft() {
    this.body.velocity.x = -this.getData("speed");
  }
  
  moveRight() {
    this.body.velocity.x = this.getData("speed");
  }

  update() {
    this.body.setVelocity(0, 0);
    this.x = Phaser.Math.Clamp(this.x, 0, this.scene.game.config.width);
    this.y = Phaser.Math.Clamp(this.y, 0, this.scene.game.config.height);
    
    if (this.getData("isShooting")) {
      if (this.getData("timerShootTick") < this.getData("timerShootDelay")) {
        this.setData("timerShootTick", this.getData("timerShootTick") + 1); // every game update, increase timerShootTick by one until we reach the value of timerShootDelay
      } else { // when the "manual timer" is triggered:
        var laser = new PlayerLaser(this.scene, this.x, this.y);
        this.scene.playerLasers.add(laser);
      
        this.scene.sfx.laser.play(); // play the laser sound effect
        this.setData("timerShootTick", 0);
      }
    }
  }

  onDestroy() {
    if (this.shootTimer !== undefined) {
      if (this.shootTimer) {
        this.shootTimer.remove(false);
      }
    }

    this.scene.time.addEvent({ // go to game over scene
      delay: 1000,
      callback: function() {
        this.scene.scene.start("SceneGameOver");
      },
      callbackScope: this,
      loop: false
    });
  }
}

class ChaserShip extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, "sprEnemy1", "ChaserShip");
    this.body.velocity.y = Phaser.Math.Between(50, 100);

    this.states = {
      MOVE_DOWN: "MOVE_DOWN",
      CHASE: "CHASE"
    }
    this.state = this.states.MOVE_DOWN
  }

  update() {
    if (!this.getData("isDead") && this.scene.player) {
      if (Phaser.Math.Distance.Between(
        this.x,
        this.y,
        this.scene.player.x,
        this.scene.player.y
      ) < 320) {
        this.state = this.states.CHASE
      }

      if (this.state = this.states.CHASE) {
        let dx = this.scene.player.x - this.x;
        let dy = this.scene.player.y - this.y;

        let angle = Math.atan2(dy, dx);

        let speed = 100;

        this.body.setVelocity(
          Math.cos(angle) * speed,
          Math.sin(angle) * speed
        )

        if (this.x < this.scene.player.x) {
          this.angle -= 5;
        } else {
          this.angle += 5;
        }
      };
    };
  }
}

class PlayerLaser extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, "sprLaserPlayer");
    this.body.velocity.y = -200;
  }
}

class GunShip extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, "sprEnemy0", "GunShip");
    this.body.velocity.y = Phaser.Math.Between(50, 100);
    this.shootTimer = this.scene.time.addEvent({
      delay: 1000,
      callback: () => {
        let laser = new EnemyLaser(
          this.scene,
          this.x,
          this.y
        );
        laser.setScale(this.scaleX);
        this.scene.enemyLasers.add(laser);
      },
      callbackScope: this,
      loop: true
    });
    this.play("sprEnemy0");
  }
}

class CarrierShip extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, "sprEnemy2", "CarrierShip");
    this.body.velocity.y = Phaser.Math.Between(50, 100);
    this.play("sprEnemy2");
  }
}

class EnemyLaser extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, "sprLaserEnemy0");
    this.body.velocity.y = 200;
  }
}

class ScrollingBackground {
  constructor(scene, key, velocityY) {
    this.scene = scene;
    this.key = key;
    this.velocityY = velocityY;

    this.layers = this.scene.add.group();

    this.createLayers();
  }

  createLayers() {
    for (let i = 0; i < 2; i++) {
      // creating two backgrounds will allow a continuous flow giving the illusion that they are moving.
      let layer = this.scene.add.sprite(0, 0, this.key);
      layer.y = (layer.displayHeight * i);
      let flipX = Phaser.Math.Between(0, 10) >= 5 ? -1 : 1;
      let flipY = Phaser.Math.Between(0, 10) >= 5 ? -1 : 1;
      layer.setScale(flipX * 2, flipY * 2);
      layer.setDepth(-5 - (i - 1));
      this.scene.physics.world.enableBody(layer, 0);
      layer.body.velocity.y = this.velocityY;

      this.layers.add(layer);
    }
  }

  update() {
    if (this.layers.getChildren()[0].y > 0) {
      for (let i = 0; i < this.layers.getChildren().length; i++) {
        let layer = this.layers.getChildren()[i];
        layer.y = (-layer.displayHeight) + (layer.displayHeight * i);
      }
    }
  }
}

export { ScrollingBackground, Entity, Player, ChaserShip, GunShip, CarrierShip };