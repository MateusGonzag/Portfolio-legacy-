import Phaser from "phaser";
import { GridEngine } from "grid-engine";
import { Home } from "../components/PhaserScenes/Home.jsx"

const canvaWidth = window.innerWidth;
const canvaHeight = window.innerHeight;

export const config = {
  type: Phaser.WEBGL,
  parent: "game-container",
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      gravity: { y: 0 },
    },
  },
  plugins: {
    scene: [
      {
        key: "gridEngine",
        plugin: GridEngine,
        mapping: "gridEngine",
      },
    ],
  },
  pixelArt: true,
  autoRound: true,
  width: canvaWidth,
  height: canvaHeight,
  scene: Home,
};

const game = new Phaser.Game(config);