/*global Asteroids */


(function() {
  if (typeof Asteroids === 'undefined') {
    window.Asteroids = { };
  }

  var Ship = Asteroids.Ship = function (pos, game) {
    Asteroids.MovingObject.call(this, {
      pos: pos,
      vel: [0,0],
      color: Ship.COLOR,
      radius: Ship.RADIUS,
      game: game
    });
    this.facing = 0;
    this.cooldown = 0;
    this.invincibility = 0;
  };
  Asteroids.Util.inherits.call(Ship, Asteroids.MovingObject);

  Ship.prototype.relocate = function() {
    this.game.lives -= 1;
    if (this.game.lives === 0) {
      this.game.remove(this);
    }
    this.pos = this.game.randomPosition();
    this.vel = [0, 0];
    this.invincibility = 200;
  };

  Ship.COLOR = "#AA00FF";
  Ship.RADIUS = 20;
  Ship.MAX_VEL = 6;

  Ship.prototype.draw = function(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.pos[0] + (this.radius * Math.cos(this.facing)),
     this.pos[1] + (this.radius * Math.sin(this.facing)));
    ctx.lineTo(this.pos[0] + (this.radius * Math.cos(this.facing + 2.5)),
     this.pos[1] + (this.radius * Math.sin(this.facing + 2.5)));
    ctx.lineTo(this.pos[0] + (this.radius * Math.cos(this.facing - 2.5)),
     this.pos[1] + (this.radius * Math.sin(this.facing - 2.5)));
    ctx.closePath();
    ctx.fill();
    if (this.invincible()) {
      ctx.fillStyle = "rgba(128, 128, 255, 0.5)";
      ctx.beginPath();
      ctx.arc(
        this.pos[0],
        this.pos[1],
        25,
        0,
        2 * Math.PI,
        false
      );
      ctx.closePath();
      ctx.fill();
    }
  };

  Ship.prototype.rotate = function(change) {
    this.facing += change;
    this.facing += 2 * Math.PI;
    this.facing = this.facing % (2 * Math.PI);
  };

  Ship.prototype.power = function(thrust) {
    this.vel[0] += thrust * Math.cos(this.facing);
    this.vel[1] += thrust * Math.sin(this.facing);

    var velocity = Math.sqrt(Math.pow(this.vel[0], 2) + Math.pow(this.vel[1], 2));

    if (velocity > Ship.MAX_VEL) {
      var dir = [];
      dir[0] = this.vel[0] / velocity;
      dir[1] = this.vel[1] / velocity;
      this.vel[0] = dir[0] * Ship.MAX_VEL;
      this.vel[1] = dir[1] * Ship.MAX_VEL;
    }
  };

  Ship.prototype.invincible = function() {
    return this.invincibility > 0;
  };

  Ship.prototype.recharge = function() {
    if (this.cooldown > 0) {
      this.cooldown -= 1;
    }
    if (this.invincibility > 0) {
      this.invincibility -= 1;
    }
  };

  Ship.prototype.fireBullet = function() {
    if (this.cooldown === 0) {
      var bulletPos = [this.pos[0] + (this.radius * Math.cos(this.facing)),
     this.pos[1] + (this.radius * Math.sin(this.facing))];
      var bullet = new Asteroids.Bullet(bulletPos, this.bulletVel(), this.game);
      this.game.add(bullet);
      this.cooldown = 40;
    }
  };

  Ship.prototype.bulletVel = function() {
    var bulletVel = [];
    bulletVel[0] = Math.cos(this.facing) * 10;
    bulletVel[1] = Math.sin(this.facing) * 10;
    return bulletVel;
  };

})();