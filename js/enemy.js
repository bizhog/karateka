var Enemy = (function() {
  var enemy = null;

  function create(config) {
    enemy = {
      x: config.x || 700,
      y: 340,
      width: 28,
      height: 80,
      health: config.health || 60,
      maxHealth: config.health || 60,
      facing: -1,
      state: 'idle',
      animFrame: 0,
      animTimer: 0,
      speed: config.speed || 1.5,
      attackCooldown: 0,
      hitStunTimer: 0,
      invincibleTimer: 0,
      attackDuration: 0,
      attackType: null,
      aiTimer: 0,
      aiDecision: 'approach',
      aggressiveness: config.aggressiveness || 0.3,
      blockChance: config.blockChance || 0.1,
      attackDamage: config.attackDamage || 8,
      name: config.name || 'Guard'
    };
    return enemy;
  }

  function update(dt, playerX) {
    if (!enemy) return;
    if (enemy.state === 'dead') return;

    // Timers
    if (enemy.attackCooldown > 0) enemy.attackCooldown -= dt;
    if (enemy.invincibleTimer > 0) enemy.invincibleTimer -= dt;

    // Hit stun
    if (enemy.hitStunTimer > 0) {
      enemy.hitStunTimer -= dt;
      if (enemy.hitStunTimer <= 0) {
        enemy.state = 'idle';
      }
      return;
    }

    // Attack duration
    if (enemy.attackDuration > 0) {
      enemy.attackDuration -= dt;
      enemy.animTimer += dt;
      enemy.animFrame = Math.floor(enemy.animTimer * 15);
      if (enemy.attackDuration <= 0) {
        enemy.state = 'idle';
        enemy.attackType = null;
        enemy.animFrame = 0;
      }
      return;
    }

    // Face player
    enemy.facing = playerX < enemy.x ? -1 : 1;

    // AI behavior
    enemy.aiTimer += dt;
    var distToPlayer = Math.abs(enemy.x - playerX);

    if (enemy.aiTimer > 0.5) {
      enemy.aiTimer = 0;
      var rand = Math.random();

      if (distToPlayer < 50) {
        // Close range - attack or block
        if (rand < enemy.aggressiveness) {
          enemy.aiDecision = 'attack';
        } else if (rand < enemy.aggressiveness + enemy.blockChance) {
          enemy.aiDecision = 'block';
        } else {
          enemy.aiDecision = 'idle';
        }
      } else if (distToPlayer < 200) {
        // Medium range - approach or wait
        if (rand < 0.7) {
          enemy.aiDecision = 'approach';
        } else {
          enemy.aiDecision = 'idle';
        }
      } else {
        // Far - approach
        enemy.aiDecision = 'approach';
      }
    }

    // Execute AI decision
    switch (enemy.aiDecision) {
      case 'approach':
        var dir = playerX < enemy.x ? -1 : 1;
        enemy.x += dir * enemy.speed;
        enemy.state = 'walking';
        enemy.animTimer += dt;
        enemy.animFrame = Math.floor(enemy.animTimer * 10);
        break;
      case 'attack':
        if (enemy.attackCooldown <= 0 && distToPlayer < 60) {
          var attackRoll = Math.random();
          if (attackRoll < 0.5) {
            enemy.state = 'punching';
            enemy.attackType = 'punch';
            enemy.attackDuration = 0.4;
          } else {
            enemy.state = 'kicking';
            enemy.attackType = 'kick';
            enemy.attackDuration = 0.5;
          }
          enemy.attackCooldown = 0.8;
          enemy.animFrame = 0;
          enemy.animTimer = 0;
        } else {
          enemy.state = 'idle';
        }
        break;
      case 'block':
        enemy.state = 'blocking';
        break;
      default:
        enemy.state = 'idle';
        enemy.animFrame = 0;
    }
  }

  function takeDamage(amount) {
    if (!enemy) return;
    if (enemy.invincibleTimer > 0) return;
    if (enemy.state === 'dead') return;

    var actualDamage = amount;
    if (enemy.state === 'blocking') {
      actualDamage = Math.floor(amount * 0.5);
    }

    enemy.health -= actualDamage;
    enemy.hitStunTimer = 0.3;
    enemy.invincibleTimer = 0.5;
    enemy.state = 'hit';

    if (enemy.health <= 0) {
      enemy.health = 0;
      enemy.state = 'dead';
    }
  }

  function getAttackHitbox() {
    if (!enemy) return null;
    if (enemy.attackDuration <= 0) return null;
    if (enemy.animFrame < 3 || enemy.animFrame > 8) return null;

    var hbX, hbY, hbW, hbH;
    if (enemy.attackType === 'punch') {
      hbW = 35;
      hbH = 15;
      hbX = enemy.facing === 1 ? enemy.x + 10 : enemy.x - 10 - hbW;
      hbY = enemy.y - 60;
    } else {
      hbW = 40;
      hbH = 15;
      hbX = enemy.facing === 1 ? enemy.x + 10 : enemy.x - 10 - hbW;
      hbY = enemy.y - 25;
    }

    return { x: hbX, y: hbY, w: hbW, h: hbH, damage: enemy.attackDamage };
  }

  function getHurtbox() {
    if (!enemy) return null;
    return {
      x: enemy.x - 14,
      y: enemy.y - 80,
      w: enemy.width,
      h: enemy.height
    };
  }

  function get() {
    return enemy;
  }

  function clear() {
    enemy = null;
  }

  function isDead() {
    return enemy && enemy.state === 'dead';
  }

  return {
    create: create,
    get: get,
    clear: clear,
    update: update,
    takeDamage: takeDamage,
    getAttackHitbox: getAttackHitbox,
    getHurtbox: getHurtbox,
    isDead: isDead
  };
})();
