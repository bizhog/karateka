var Player = (function() {
  var player = {
    x: 100,
    y: 340,
    width: 28,
    height: 80,
    health: 100,
    maxHealth: 100,
    facing: 1,
    state: 'idle',
    animFrame: 0,
    animTimer: 0,
    speed: 3,
    attackCooldown: 0,
    hitStunTimer: 0,
    invincibleTimer: 0,
    attackDuration: 0,
    attackType: null
  };

  function reset() {
    player.x = 100;
    player.y = 340;
    player.health = 100;
    player.facing = 1;
    player.state = 'idle';
    player.animFrame = 0;
    player.animTimer = 0;
    player.attackCooldown = 0;
    player.hitStunTimer = 0;
    player.invincibleTimer = 0;
    player.attackDuration = 0;
    player.attackType = null;
  }

  function update(dt) {
    // Timers
    if (player.attackCooldown > 0) player.attackCooldown -= dt;
    if (player.invincibleTimer > 0) player.invincibleTimer -= dt;

    // Hit stun
    if (player.hitStunTimer > 0) {
      player.hitStunTimer -= dt;
      if (player.hitStunTimer <= 0) {
        player.state = 'idle';
      }
      return;
    }

    // Death
    if (player.state === 'dead') return;

    // Attack duration
    if (player.attackDuration > 0) {
      player.attackDuration -= dt;
      player.animTimer += dt;
      player.animFrame = Math.floor(player.animTimer * 15);
      if (player.attackDuration <= 0) {
        player.state = 'idle';
        player.attackType = null;
        player.animFrame = 0;
      }
      return;
    }

    // Input handling
    var moving = false;

    if (Input.isDown('ArrowUp')) {
      player.state = 'blocking';
    } else if (Input.wasPressed('KeyZ') && player.attackCooldown <= 0) {
      player.state = 'punching';
      player.attackType = 'punch';
      player.attackDuration = 0.4;
      player.attackCooldown = 0.5;
      player.animFrame = 0;
      player.animTimer = 0;
    } else if (Input.wasPressed('KeyX') && player.attackCooldown <= 0) {
      player.state = 'kicking';
      player.attackType = 'kick';
      player.attackDuration = 0.5;
      player.attackCooldown = 0.6;
      player.animFrame = 0;
      player.animTimer = 0;
    } else {
      if (Input.isDown('ArrowLeft')) {
        player.x -= player.speed;
        player.facing = -1;
        moving = true;
      }
      if (Input.isDown('ArrowRight')) {
        player.x += player.speed;
        player.facing = 1;
        moving = true;
      }

      if (moving) {
        player.state = 'walking';
        player.animTimer += dt;
        player.animFrame = Math.floor(player.animTimer * 10);
      } else {
        if (player.state !== 'blocking') {
          player.state = 'idle';
          player.animFrame = 0;
        }
      }
    }

    // Clamp position
    if (player.x < 30) player.x = 30;
  }

  function takeDamage(amount) {
    if (player.invincibleTimer > 0) return;
    if (player.state === 'dead') return;

    var actualDamage = amount;
    if (player.state === 'blocking') {
      actualDamage = Math.floor(amount * 0.5);
    }

    player.health -= actualDamage;
    player.hitStunTimer = 0.3;
    player.invincibleTimer = 0.5;
    player.state = 'hit';

    if (player.health <= 0) {
      player.health = 0;
      player.state = 'dead';
    }
  }

  function getAttackHitbox() {
    if (player.attackDuration <= 0) return null;
    if (player.animFrame < 3 || player.animFrame > 8) return null;

    var hbX, hbY, hbW, hbH;
    if (player.attackType === 'punch') {
      hbW = 35;
      hbH = 15;
      hbX = player.facing === 1 ? player.x + 10 : player.x - 10 - hbW;
      hbY = player.y - 60;
    } else {
      hbW = 40;
      hbH = 15;
      hbX = player.facing === 1 ? player.x + 10 : player.x - 10 - hbW;
      hbY = player.y - 25;
    }

    return { x: hbX, y: hbY, w: hbW, h: hbH, damage: player.attackType === 'punch' ? 10 : 15 };
  }

  function getHurtbox() {
    return {
      x: player.x - 14,
      y: player.y - 80,
      w: player.width,
      h: player.height
    };
  }

  function get() {
    return player;
  }

  return {
    get: get,
    reset: reset,
    update: update,
    takeDamage: takeDamage,
    getAttackHitbox: getAttackHitbox,
    getHurtbox: getHurtbox
  };
})();
