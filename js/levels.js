var Levels = (function() {
  var enemies = [
    {
      name: 'Guard',
      health: 50,
      speed: 1.2,
      aggressiveness: 0.25,
      blockChance: 0.05,
      attackDamage: 8
    },
    {
      name: 'Soldier',
      health: 60,
      speed: 1.5,
      aggressiveness: 0.35,
      blockChance: 0.1,
      attackDamage: 10
    },
    {
      name: 'Warrior',
      health: 70,
      speed: 1.8,
      aggressiveness: 0.4,
      blockChance: 0.15,
      attackDamage: 12
    },
    {
      name: 'Elite Guard',
      health: 80,
      speed: 2.0,
      aggressiveness: 0.5,
      blockChance: 0.2,
      attackDamage: 14
    },
    {
      name: 'Captain',
      health: 90,
      speed: 2.2,
      aggressiveness: 0.55,
      blockChance: 0.25,
      attackDamage: 16
    },
    {
      name: 'Champion',
      health: 100,
      speed: 2.5,
      aggressiveness: 0.6,
      blockChance: 0.3,
      attackDamage: 18
    },
    {
      name: 'Warlord',
      health: 120,
      speed: 2.8,
      aggressiveness: 0.7,
      blockChance: 0.35,
      attackDamage: 20
    }
  ];

  var currentIndex = 0;

  function reset() {
    currentIndex = 0;
  }

  function getCurrentEnemyConfig() {
    if (currentIndex >= enemies.length) return null;
    return enemies[currentIndex];
  }

  function advance() {
    currentIndex++;
  }

  function getCurrentIndex() {
    return currentIndex;
  }

  function getTotalEnemies() {
    return enemies.length;
  }

  function isComplete() {
    return currentIndex >= enemies.length;
  }

  return {
    reset: reset,
    getCurrentEnemyConfig: getCurrentEnemyConfig,
    advance: advance,
    getCurrentIndex: getCurrentIndex,
    getTotalEnemies: getTotalEnemies,
    isComplete: isComplete
  };
})();
