// src/constants.ts

export const GAME_SETTINGS = {
  MOLE_COUNT: 9,
  BASE_DURATION: 30,
  HIT_DISPLAY_DURATION: 1000,
  POWERUP_CHANCE: 0.1,
  DIFFICULTY_SETTINGS: {
    easy: {
      moleSpeed: 1200,
      points: 1
    },
    normal: {
      moleSpeed: 800,
      points: 2
    },
    hard: {
      moleSpeed: 600,
      points: 3
    }
  }
};

export const POWER_UPS = {
  doublePoints: {
    duration: 5000,
    icon: '✨'
  },
  slowMotion: {
    duration: 5000,
    icon: '⏰'
  },
  extraTime: {
    duration: 0,
    icon: '⌛'
  }
};