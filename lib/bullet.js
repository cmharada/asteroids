/*global Asteroids */

(function() {
  if (typeof Asteroids === 'undefined') {
    window.Asteroids = { };
  }
  
  var Bullet = Asteroids.Bullet = function (pos, vel, game) {
    Asteroids.MovingObject.call(this, {
      pos: pos,
      vel: vel,
      color: Bullet.COLOR,
      radius: Bullet.RADIUS,
      game: game
    });
    
    this.isWrappable = false;
  };
  Asteroids.Util.inherits.call(Bullet, Asteroids.MovingObject);
  
  Bullet.COLOR = "123456";
  Bullet.RADIUS = 5;
  
  Bullet.prototype.collideWith = function (otherObject) {
    if (otherObject instanceof Asteroids.Asteroid) {
      this.game.remove(otherObject);
      this.game.remove(this);
    }
  };
  

})();