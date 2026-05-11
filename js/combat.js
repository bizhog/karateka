var Combat = (function() {
  var playerHitRegistered = false;
  var enemyHitRegistered = false;

  function reset() {
    playerHitRegistered = false;
    enemyHitRegistered = false;
  }

  function update() {
    // Check player attack hitting enemy
    var playerHitbox = Player.getAttackHitbox();
    var enemyHurtbox = Enemy.getHurtbox();

    if (playerHitbox && enemyHurtbox && !playerHitRegistered) {
      if (boxesOverlap(playerHitbox, enemyHurtbox)) {
        Enemy.takeDamage(playerHitbox.damage);
        playerHitRegistered = true;
      }
    }

    // Reset hit registration when attack ends
    if (!playerHitbox) {
      playerHitRegistered = false;
    }

    // Check enemy attack hitting player
    var enemyHitbox = Enemy.getAttackHitbox();
    var playerHurtbox = Player.getHurtbox();

    if (enemyHitbox && playerHurtbox && !enemyHitRegistered) {
      if (boxesOverlap(enemyHitbox, playerHurtbox)) {
        Player.takeDamage(enemyHitbox.damage);
        enemyHitRegistered = true;
      }
    }

    // Reset hit registration when attack ends
    if (!enemyHitbox) {
      enemyHitRegistered = false;
    }
  }

  function boxesOverlap(a, b) {
    return a.x < b.x + b.w &&
           a.x + a.w > b.x &&
           a.y < b.y + b.h &&
           a.y + a.h > b.y;
  }

  return {
    update: update,
    reset: reset
  };
})();
