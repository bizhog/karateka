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
    // Bright cyan sky - classic Karateka look
    ctx.fillStyle = '#00ccff';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Slight gradient at top for depth
    var skyGrad = ctx.createLinearGradient(0, 0, 0, 200);
    skyGrad.addColorStop(0, '#44ddff');
    skyGrad.addColorStop(1, '#00bbee');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, canvasWidth, 200);

    // Mt. Fuji silhouette in the distance (parallax - very slow)
    drawMtFuji(cameraX);

    // Fortress walls on left side (parallax - medium)
    drawFortressWall(cameraX);

    // Horizontal fence/railing across middle
    drawFence(cameraX);

    // Floor - vivid red/magenta
    drawFloor(cameraX);
  }

  function drawMtFuji(cameraX) {
    var offset = -(cameraX * 0.1);
    var fujiX = 500 + offset;

    // Mountain base - distant blue-gray
    ctx.fillStyle = '#6688aa';
    ctx.beginPath();
    ctx.moveTo(fujiX - 180, 220);
    ctx.lineTo(fujiX, 80);
    ctx.lineTo(fujiX + 180, 220);
    ctx.closePath();
    ctx.fill();

    // Snow cap - white peak
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(fujiX - 40, 130);
    ctx.lineTo(fujiX, 80);
    ctx.lineTo(fujiX + 40, 130);
    // Jagged snow line
    ctx.lineTo(fujiX + 30, 125);
    ctx.lineTo(fujiX + 15, 135);
    ctx.lineTo(fujiX, 128);
    ctx.lineTo(fujiX - 15, 135);
    ctx.lineTo(fujiX - 30, 125);
    ctx.closePath();
    ctx.fill();

    // Secondary distant mountains
    ctx.fillStyle = '#557799';
    ctx.beginPath();
    ctx.moveTo(fujiX - 350, 220);
    ctx.lineTo(fujiX - 250, 150);
    ctx.lineTo(fujiX - 150, 220);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(fujiX + 100, 220);
    ctx.lineTo(fujiX + 250, 140);
    ctx.lineTo(fujiX + 400, 220);
    ctx.closePath();
    ctx.fill();
  }

  function drawFortressWall(cameraX) {
    var wallOffset = -(cameraX * 0.5);

    // Dark purple/indigo fortress wall on left side
    ctx.fillStyle = '#1a0033';
    ctx.fillRect(0, 180, 200 + wallOffset * 0.3, 160);

    // Fortress tower/battlement
    ctx.fillStyle = '#220044';
    ctx.fillRect(0, 150, 80 + wallOffset * 0.2, 190);

    // Angular stairs going up on fortress
    ctx.fillStyle = '#2a0055';
    var stairX = 80 + wallOffset * 0.2;
    for (var i = 0; i < 6; i++) {
      ctx.fillRect(stairX + i * 20, 200 + i * 20, 22, 140 - i * 20);
    }

    // Fortress wall top edge - crenellations
    ctx.fillStyle = '#330066';
    var crenX = wallOffset * 0.2;
    for (var j = 0; j < 5; j++) {
      ctx.fillRect(crenX + j * 35, 145, 20, 15);
    }

    // Dark window slits
    ctx.fillStyle = '#000011';
    ctx.fillRect(30 + wallOffset * 0.1, 180, 8, 20);
    ctx.fillRect(55 + wallOffset * 0.1, 180, 8, 20);
  }

  function drawFence(cameraX) {
    var fenceOffset = -(cameraX * 0.6) % 50;

    // Horizontal railing bars
    ctx.fillStyle = '#1a0033';
    ctx.fillRect(0, 235, canvasWidth, 3);
    ctx.fillRect(0, 255, canvasWidth, 3);

    // Vertical fence posts
    ctx.fillStyle = '#220044';
    for (var x = fenceOffset; x < canvasWidth; x += 50) {
      ctx.fillRect(x, 225, 4, 40);
    }

    // Top cap on posts
    ctx.fillStyle = '#330055';
    for (var x2 = fenceOffset; x2 < canvasWidth; x2 += 50) {
      ctx.fillRect(x2 - 1, 222, 6, 5);
    }
  }

  function drawFloor(cameraX) {
    // Vivid red/magenta floor - classic Karateka style
    ctx.fillStyle = '#cc2255';
    ctx.fillRect(0, 340, canvasWidth, 60);

    // Slightly darker red floor tiles for texture
    var tileOffset = -(cameraX % 40);
    ctx.strokeStyle = '#aa1144';
    ctx.lineWidth = 1;
    for (var x = tileOffset; x < canvasWidth; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 340);
      ctx.lineTo(x, 400);
      ctx.stroke();
    }

    // Horizontal line in floor for depth
    ctx.strokeStyle = '#aa1144';
    ctx.beginPath();
    ctx.moveTo(0, 365);
    ctx.lineTo(canvasWidth, 365);
    ctx.stroke();

    // Floor top edge - brighter pink highlight
    ctx.fillStyle = '#ee3377';
    ctx.fillRect(0, 337, canvasWidth, 4);

    // Dark line between scene and floor
    ctx.fillStyle = '#110022';
    ctx.fillRect(0, 335, canvasWidth, 3);
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

    var bodyColor = isPlayer ? '#f0f0f0' : '#cc2222';
    var skinColor = '#e8b878';
    var pantsColor = isPlayer ? '#e8e8e8' : '#881111';
    var beltColor = isPlayer ? '#111111' : '#442222';

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
