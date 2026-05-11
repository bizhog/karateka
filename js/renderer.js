var Renderer = (function() {
  var ctx;
  var canvasWidth = 800;
  var canvasHeight = 400;

  function init(context) {
    ctx = context;
  }

  function clear() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  }

  function drawBackground(cameraX) {
    // Sky gradient
    var grad = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    grad.addColorStop(0, '#1a0a2e');
    grad.addColorStop(0.5, '#2d1b4e');
    grad.addColorStop(1, '#0f0f23');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Mountains (parallax - slow)
    var mountainOffset = -(cameraX * 0.2) % canvasWidth;
    ctx.fillStyle = '#1e1e3a';
    drawMountains(mountainOffset, 180, 120);

    // Closer hills (parallax - medium)
    var hillOffset = -(cameraX * 0.4) % canvasWidth;
    ctx.fillStyle = '#16162e';
    drawMountains(hillOffset, 220, 80);

    // Fortress wall (parallax - fast)
    drawFortressWall(cameraX);

    // Floor
    drawFloor(cameraX);
  }

  function drawMountains(offset, baseY, height) {
    ctx.beginPath();
    ctx.moveTo(0, canvasHeight);
    for (var x = -200 + offset; x < canvasWidth + 200; x += 150) {
      ctx.lineTo(x, baseY + Math.sin(x * 0.01) * 20);
      ctx.lineTo(x + 75, baseY - height + Math.sin(x * 0.02) * 30);
      ctx.lineTo(x + 150, baseY + Math.sin(x * 0.015) * 20);
    }
    ctx.lineTo(canvasWidth, canvasHeight);
    ctx.closePath();
    ctx.fill();
  }

  function drawFortressWall(cameraX) {
    var wallOffset = -(cameraX * 0.6) % 120;
    ctx.fillStyle = '#2a2a4a';
    ctx.fillRect(0, 250, canvasWidth, 20);

    // Battlements
    for (var x = wallOffset; x < canvasWidth; x += 60) {
      ctx.fillStyle = '#2a2a4a';
      ctx.fillRect(x, 235, 30, 35);
      ctx.fillStyle = '#222240';
      ctx.fillRect(x + 5, 240, 20, 15);
    }
  }

  function drawFloor(cameraX) {
    // Main floor
    ctx.fillStyle = '#3d2b1f';
    ctx.fillRect(0, 340, canvasWidth, 60);

    // Floor tiles
    var tileOffset = -(cameraX % 40);
    ctx.strokeStyle = '#2a1f15';
    ctx.lineWidth = 1;
    for (var x = tileOffset; x < canvasWidth; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 340);
      ctx.lineTo(x, 400);
      ctx.stroke();
    }

    // Floor top edge
    ctx.fillStyle = '#4a3628';
    ctx.fillRect(0, 338, canvasWidth, 4);
  }

  function drawCharacter(character, cameraX, isPlayer) {
    var screenX = character.x - cameraX;
    var screenY = character.y;
    var facing = character.facing;
    var state = character.state;
    var frame = character.animFrame;

    ctx.save();
    ctx.translate(screenX, screenY);
    if (facing === -1) {
      ctx.scale(-1, 1);
    }

    var bodyColor = isPlayer ? '#4488ff' : '#ff4444';
    var skinColor = '#ffcc88';
    var pantsColor = isPlayer ? '#2244aa' : '#aa2222';
    var beltColor = '#222222';

    switch (state) {
      case 'idle':
        drawIdle(bodyColor, skinColor, pantsColor, beltColor);
        break;
      case 'walking':
        drawWalk(bodyColor, skinColor, pantsColor, beltColor, frame);
        break;
      case 'punching':
        drawPunch(bodyColor, skinColor, pantsColor, beltColor, frame);
        break;
      case 'kicking':
        drawKick(bodyColor, skinColor, pantsColor, beltColor, frame);
        break;
      case 'blocking':
        drawBlock(bodyColor, skinColor, pantsColor, beltColor);
        break;
      case 'hit':
        drawHit(bodyColor, skinColor, pantsColor, beltColor);
        break;
      case 'dead':
        drawDead(bodyColor, skinColor, pantsColor, beltColor);
        break;
      default:
        drawIdle(bodyColor, skinColor, pantsColor, beltColor);
    }

    ctx.restore();
  }

  function drawIdle(body, skin, pants, belt) {
    // Legs
    ctx.fillStyle = pants;
    ctx.fillRect(-8, -30, 7, 30);
    ctx.fillRect(1, -30, 7, 30);

    // Body/torso
    ctx.fillStyle = body;
    ctx.fillRect(-10, -62, 20, 34);

    // Belt
    ctx.fillStyle = belt;
    ctx.fillRect(-10, -32, 20, 4);

    // Head
    ctx.fillStyle = skin;
    ctx.fillRect(-7, -78, 14, 14);

    // Hair
    ctx.fillStyle = '#222';
    ctx.fillRect(-7, -80, 14, 5);

    // Arms - relaxed
    ctx.fillStyle = body;
    ctx.fillRect(-14, -60, 5, 20);
    ctx.fillRect(9, -60, 5, 20);

    // Hands
    ctx.fillStyle = skin;
    ctx.fillRect(-14, -42, 5, 5);
    ctx.fillRect(9, -42, 5, 5);

    // Feet
    ctx.fillStyle = '#222';
    ctx.fillRect(-9, -2, 8, 3);
    ctx.fillRect(1, -2, 8, 3);
  }

  function drawWalk(body, skin, pants, belt, frame) {
    var legOffset = Math.sin(frame * 0.3) * 8;

    // Legs
    ctx.fillStyle = pants;
    ctx.fillRect(-8 + legOffset, -30, 7, 30);
    ctx.fillRect(1 - legOffset, -30, 7, 30);

    // Body/torso
    ctx.fillStyle = body;
    ctx.fillRect(-10, -62, 20, 34);

    // Belt
    ctx.fillStyle = belt;
    ctx.fillRect(-10, -32, 20, 4);

    // Head
    ctx.fillStyle = skin;
    ctx.fillRect(-7, -78, 14, 14);

    // Hair
    ctx.fillStyle = '#222';
    ctx.fillRect(-7, -80, 14, 5);

    // Arms - swinging
    ctx.fillStyle = body;
    ctx.fillRect(-14 - legOffset * 0.3, -60, 5, 20);
    ctx.fillRect(9 + legOffset * 0.3, -60, 5, 20);

    // Hands
    ctx.fillStyle = skin;
    ctx.fillRect(-14 - legOffset * 0.3, -42, 5, 5);
    ctx.fillRect(9 + legOffset * 0.3, -42, 5, 5);

    // Feet
    ctx.fillStyle = '#222';
    ctx.fillRect(-9 + legOffset, -2, 8, 3);
    ctx.fillRect(1 - legOffset, -2, 8, 3);
  }

  function drawPunch(body, skin, pants, belt, frame) {
    var extend = frame < 5 ? frame * 6 : 30 - (frame - 5) * 6;
    extend = Math.max(0, Math.min(30, extend));

    // Legs
    ctx.fillStyle = pants;
    ctx.fillRect(-8, -30, 7, 30);
    ctx.fillRect(3, -30, 7, 30);

    // Body/torso - slight lean forward
    ctx.fillStyle = body;
    ctx.fillRect(-8, -62, 20, 34);

    // Belt
    ctx.fillStyle = belt;
    ctx.fillRect(-8, -32, 20, 4);

    // Head
    ctx.fillStyle = skin;
    ctx.fillRect(-5, -78, 14, 14);

    // Hair
    ctx.fillStyle = '#222';
    ctx.fillRect(-5, -80, 14, 5);

    // Punching arm - extended
    ctx.fillStyle = body;
    ctx.fillRect(10, -58, extend, 5);

    // Fist
    ctx.fillStyle = skin;
    ctx.fillRect(10 + extend, -59, 7, 7);

    // Back arm
    ctx.fillStyle = body;
    ctx.fillRect(-14, -58, 5, 15);
    ctx.fillStyle = skin;
    ctx.fillRect(-14, -44, 5, 5);

    // Feet
    ctx.fillStyle = '#222';
    ctx.fillRect(-9, -2, 8, 3);
    ctx.fillRect(3, -2, 8, 3);
  }

  function drawKick(body, skin, pants, belt, frame) {
    var extend = frame < 5 ? frame * 7 : 35 - (frame - 5) * 7;
    extend = Math.max(0, Math.min(35, extend));

    // Standing leg
    ctx.fillStyle = pants;
    ctx.fillRect(-8, -30, 7, 30);

    // Kicking leg - extended horizontally
    ctx.fillStyle = pants;
    ctx.fillRect(0, -25, extend, 7);

    // Foot on kick
    ctx.fillStyle = '#222';
    ctx.fillRect(extend, -26, 8, 8);

    // Body/torso - lean back
    ctx.fillStyle = body;
    ctx.fillRect(-12, -62, 20, 34);

    // Belt
    ctx.fillStyle = belt;
    ctx.fillRect(-12, -32, 20, 4);

    // Head
    ctx.fillStyle = skin;
    ctx.fillRect(-9, -78, 14, 14);

    // Hair
    ctx.fillStyle = '#222';
    ctx.fillRect(-9, -80, 14, 5);

    // Arms - guard position
    ctx.fillStyle = body;
    ctx.fillRect(-16, -60, 5, 18);
    ctx.fillRect(6, -60, 5, 18);
    ctx.fillStyle = skin;
    ctx.fillRect(-16, -44, 5, 5);
    ctx.fillRect(6, -44, 5, 5);

    // Standing foot
    ctx.fillStyle = '#222';
    ctx.fillRect(-9, -2, 8, 3);
  }

  function drawBlock(body, skin, pants, belt) {
    // Legs - wide stance
    ctx.fillStyle = pants;
    ctx.fillRect(-10, -28, 7, 28);
    ctx.fillRect(3, -28, 7, 28);

    // Body/torso
    ctx.fillStyle = body;
    ctx.fillRect(-10, -60, 20, 34);

    // Belt
    ctx.fillStyle = belt;
    ctx.fillRect(-10, -30, 20, 4);

    // Head - slightly ducked
    ctx.fillStyle = skin;
    ctx.fillRect(-7, -74, 14, 14);

    // Hair
    ctx.fillStyle = '#222';
    ctx.fillRect(-7, -76, 14, 5);

    // Arms - crossed guard
    ctx.fillStyle = body;
    ctx.fillRect(-4, -60, 5, 22);
    ctx.fillRect(-1, -60, 5, 22);

    // Hands - guard
    ctx.fillStyle = skin;
    ctx.fillRect(-5, -62, 12, 6);

    // Feet
    ctx.fillStyle = '#222';
    ctx.fillRect(-11, -2, 8, 3);
    ctx.fillRect(3, -2, 8, 3);
  }

  function drawHit(body, skin, pants, belt) {
    // Leaning back - hit stun
    ctx.save();
    ctx.rotate(-0.15);

    // Legs
    ctx.fillStyle = pants;
    ctx.fillRect(-6, -30, 7, 30);
    ctx.fillRect(3, -30, 7, 30);

    // Body/torso
    ctx.fillStyle = body;
    ctx.fillRect(-10, -62, 20, 34);

    // Belt
    ctx.fillStyle = belt;
    ctx.fillRect(-10, -32, 20, 4);

    // Head
    ctx.fillStyle = skin;
    ctx.fillRect(-7, -78, 14, 14);

    // Hair
    ctx.fillStyle = '#222';
    ctx.fillRect(-7, -80, 14, 5);

    // Arms - flailing
    ctx.fillStyle = body;
    ctx.fillRect(-16, -55, 5, 18);
    ctx.fillRect(12, -50, 5, 18);
    ctx.fillStyle = skin;
    ctx.fillRect(-16, -38, 5, 5);
    ctx.fillRect(12, -33, 5, 5);

    // Feet
    ctx.fillStyle = '#222';
    ctx.fillRect(-7, -2, 8, 3);
    ctx.fillRect(3, -2, 8, 3);

    ctx.restore();
  }

  function drawDead(body, skin, pants, belt) {
    // Lying on ground
    ctx.save();
    ctx.translate(0, 50);
    ctx.rotate(Math.PI / 2);

    // Body
    ctx.fillStyle = body;
    ctx.fillRect(-10, -30, 20, 34);

    // Legs
    ctx.fillStyle = pants;
    ctx.fillRect(-8, 4, 7, 25);
    ctx.fillRect(1, 4, 7, 25);

    // Head
    ctx.fillStyle = skin;
    ctx.fillRect(-7, -44, 14, 14);

    // Arms
    ctx.fillStyle = body;
    ctx.fillRect(-14, -25, 5, 18);
    ctx.fillRect(9, -20, 5, 18);

    ctx.restore();
  }

  function drawHealthBar(x, y, width, health, maxHealth, label, color) {
    var ratio = Math.max(0, health / maxHealth);

    // Background
    ctx.fillStyle = '#333';
    ctx.fillRect(x, y, width, 16);

    // Health fill
    ctx.fillStyle = color;
    ctx.fillRect(x + 2, y + 2, (width - 4) * ratio, 12);

    // Border
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, 16);

    // Label
    ctx.fillStyle = '#fff';
    ctx.font = '10px Courier New';
    ctx.fillText(label, x, y - 4);
  }

  function drawText(text, x, y, size, color, align) {
    ctx.fillStyle = color || '#fff';
    ctx.font = (size || 16) + 'px Courier New';
    ctx.textAlign = align || 'center';
    ctx.fillText(text, x, y);
    ctx.textAlign = 'left';
  }

  return {
    init: init,
    clear: clear,
    drawBackground: drawBackground,
    drawCharacter: drawCharacter,
    drawHealthBar: drawHealthBar,
    drawText: drawText
  };
})();
