var Input = (function() {
  var keys = {};
  var justPressed = {};

  var gameKeys = [
    'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
    'KeyZ', 'KeyX', 'Space'
  ];

  function init() {
    window.addEventListener('keydown', function(e) {
      if (gameKeys.indexOf(e.code) !== -1) {
        e.preventDefault();
      }
      if (!keys[e.code]) {
        justPressed[e.code] = true;
      }
      keys[e.code] = true;
    });

    window.addEventListener('keyup', function(e) {
      if (gameKeys.indexOf(e.code) !== -1) {
        e.preventDefault();
      }
      keys[e.code] = false;
    });
  }

  function isDown(code) {
    return !!keys[code];
  }

  function wasPressed(code) {
    return !!justPressed[code];
  }

  function update() {
    justPressed = {};
  }

  return {
    init: init,
    isDown: isDown,
    wasPressed: wasPressed,
    update: update
  };
})();
