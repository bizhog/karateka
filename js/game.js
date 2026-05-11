var Game = (function() {
  var canvas, ctx;
  var gameState = 'title'; // title, playing, gameover, victory
  var cameraX = 0;
  var lastTime = 0;
  var enemyDeathTimer = 0;
  var ENEMY_DEATH_DELAY = 1.5;

  function init() {
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');

    Input.init();
    Renderer.init(ctx);

    lastTime = performance.now();
    requestAnimationFrame(loop);
  }

  function loop(timestamp) {
    var dt = (timestamp - lastTime) / 1000;
    if (dt > 0.1) dt = 0.1; // Cap delta time
    lastTime = timestamp;

    update(dt);
    render();
    Input.update();

    requestAnimationFrame(loop);
  }

  function update(dt) {
    switch (gameState) {
      case 'title':
        if (Input.wasPressed('Space')) {
          startGame();
        }
        break;

      case 'playing':
        Player.update(dt);
        updateCamera();

        var playerData = Player.get();
        var enemyData = Enemy.get();

        if (enemyData) {
          if (enemyData.state === 'dead') {
            enemyDeathTimer += dt;
            if (enemyDeathTimer >= ENEMY_DEATH_DELAY) {
              enemyDeathTimer = 0;
              Levels.advance();
              if (Levels.isComplete()) {
                gameState = 'victory';
              } else {
                spawnNextEnemy();
              }
            }
          } else {
            Enemy.update(dt, playerData.x);
            Combat.update();
          }
        }

        // Check player death
        if (playerData.state === 'dead') {
          gameState = 'gameover';
        }
        break;

      case 'gameover':
        if (Input.wasPressed('Space')) {
          startGame();
        }
        break;

      case 'victory':
        if (Input.wasPressed('Space')) {
          startGame();
        }
        break;
    }
  }

  function startGame() {
    gameState = 'playing';
    Player.reset();
    Levels.reset();
    Combat.reset();
    cameraX = 0;
    enemyDeathTimer = 0;
    spawnNextEnemy();
  }

  function spawnNextEnemy() {
    var config = Levels.getCurrentEnemyConfig();
    if (config) {
      var playerData = Player.get();
      config.x = playerData.x + 300;
      Enemy.create(config);
    }
  }

  function updateCamera() {
    var playerData = Player.get();
    var targetX = playerData.x - 200;
    if (targetX < 0) targetX = 0;
    cameraX += (targetX - cameraX) * 0.05;
  }

  function render() {
    Renderer.clear();

    switch (gameState) {
      case 'title':
        renderTitle();
        break;
      case 'playing':
        renderGame();
        break;
      case 'gameover':
        renderGame();
        renderGameOver();
        break;
      case 'victory':
        renderGame();
        renderVictory();
        break;
    }
  }

  function renderTitle() {
    Renderer.drawBackground(0);

    Renderer.drawText('KARATEKA', 400, 120, 48, '#ff6b35', 'center');
    Renderer.drawText('A Martial Arts Battle', 400, 160, 16, '#aaa', 'center');
    Renderer.drawText('Press SPACE to Start', 400, 260, 20, '#fff', 'center');
    Renderer.drawText('Controls:', 400, 310, 14, '#888', 'center');
    Renderer.drawText('Arrow Keys: Move | Z: Punch | X: Kick | Up: Block', 400, 335, 12, '#666', 'center');
  }

  function renderGame() {
    Renderer.drawBackground(cameraX);

    // Draw player
    var playerData = Player.get();
    Renderer.drawCharacter(playerData, cameraX, true);

    // Draw enemy
    var enemyData = Enemy.get();
    if (enemyData) {
      Renderer.drawCharacter(enemyData, cameraX, false);
    }

    // HUD
    renderHUD();
  }

  function renderHUD() {
    var playerData = Player.get();
    Renderer.drawHealthBar(20, 30, 180, playerData.health, playerData.maxHealth, 'PLAYER', '#44cc44');

    var enemyData = Enemy.get();
    if (enemyData && enemyData.state !== 'dead') {
      Renderer.drawHealthBar(600, 30, 180, enemyData.health, enemyData.maxHealth, enemyData.name.toUpperCase(), '#cc4444');
    }

    // Enemy counter
    var current = Levels.getCurrentIndex() + 1;
    var total = Levels.getTotalEnemies();
    if (current > total) current = total;
    Renderer.drawText('Enemy ' + current + '/' + total, 400, 25, 12, '#aaa', 'center');
  }

  function renderGameOver() {
    // Overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, 800, 400);

    Renderer.drawText('GAME OVER', 400, 170, 40, '#ff4444', 'center');
    Renderer.drawText('You have been defeated', 400, 220, 16, '#aaa', 'center');
    Renderer.drawText('Press SPACE to Restart', 400, 280, 18, '#fff', 'center');
  }

  function renderVictory() {
    // Overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, 800, 400);

    Renderer.drawText('VICTORY', 400, 150, 48, '#ffdd44', 'center');
    Renderer.drawText('You have defeated all enemies!', 400, 200, 16, '#aaa', 'center');
    Renderer.drawText('The fortress is yours.', 400, 230, 14, '#888', 'center');
    Renderer.drawText('Press SPACE to Play Again', 400, 300, 18, '#fff', 'center');
  }

  return {
    init: init
  };
})();
