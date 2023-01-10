import Phaser from "phaser";
import AnimatedTiles from "phaser-animated-tiles/dist/AnimatedTiles.min.js";
import { HOME_SCENE_IMPORTS } from "../../config/imports.js";

let map;
let playerSprite;
let lastKey;
let ifMove;
let dialogChange;

export default function HomeFunction(props) {
  dialogChange = props.dialogChange;
  ifMove = props.showDialogBox;
}

export class Home extends Phaser.Scene {
  constructor(config) {
    super(config);
  }

  preload() {
    this.load.tilemapTiledJSON("map", HOME_SCENE_IMPORTS.tilesets.mapa);

    this.load.image("atendente", HOME_SCENE_IMPORTS.tilesets.atendente);
    this.load.image("casa", HOME_SCENE_IMPORTS.tilesets.casa);
    this.load.image("cloud", HOME_SCENE_IMPORTS.tilesets.cloud);
    this.load.image("dude", HOME_SCENE_IMPORTS.tilesets.dude);
    this.load.image("externo", HOME_SCENE_IMPORTS.tilesets.externo);
    this.load.image("externo2", HOME_SCENE_IMPORTS.tilesets.externo2);
    this.load.image("floors", HOME_SCENE_IMPORTS.tilesets.floors);
    this.load.image("housedog", HOME_SCENE_IMPORTS.tilesets.housedog);
    this.load.image("outdoors", HOME_SCENE_IMPORTS.tilesets.outdoors);
    this.load.image("terrain", HOME_SCENE_IMPORTS.tilesets.terrain);
    this.load.image("terrain2", HOME_SCENE_IMPORTS.tilesets.terrain2);

    this.load.spritesheet("eu", HOME_SCENE_IMPORTS.sprites.eu, {
      frameWidth: 16,
      frameHeight: 31.5,
    });

    this.load.scenePlugin(
      "animatedTiles",
      AnimatedTiles,
      "animatedTiles",
      "animatedTiles"
    );

    this.load.audio("steps", HOME_SCENE_IMPORTS.audios.passos);
  }

  create() {
    let bass = this.sound.add("steps");

    map = this.make.tilemap({ key: "map" });
    map.addTilesetImage("atendente", "atendente");
    map.addTilesetImage("casa", "casa");
    map.addTilesetImage("cloud", "cloud");
    map.addTilesetImage("dude", "dude");
    map.addTilesetImage("externo", "externo");
    map.addTilesetImage("externo2", "externo2");
    map.addTilesetImage("floors", "floors");
    map.addTilesetImage("housedog", "housedog");
    map.addTilesetImage("outdoors", "outdoors");
    map.addTilesetImage("terrain", "terrain");
    map.addTilesetImage("terrain2", "terrain2");

    for (let i = 0; i < map.layers.length; i++) {
      const layer = map.createLayer(
        i,
        [
          "atendente",
          "casa",
          "cloud",
          "dude",
          "externo",
          "externo2",
          "floors",
          "housedog",
          "outdoors",
          "terrain",
          "terrain2",
        ],
        0,
        0
      );
      layer.scale = 3;
    }

    this.animatedTiles.init(map);

    playerSprite = this.add.sprite(0, 0, "eu").setInteractive();
    playerSprite.scale = 3;
    playerSprite.on("pointerdown", () => {
      dialogChange("sobreMim");
    });

    this.cameras.main.startFollow(playerSprite, true, 0.1, 0.1);
    this.cameras.main.setRoundPixels(true);
    this.cameras.main.setBounds(0, 0, 5760, 5000);
    this.cameras.main.setZoom(0.8);
    this.cameras.main.setFollowOffset(
      -playerSprite.width,
      -playerSprite.height
    );

    createPlayerAnimation.call(this, "up", 8, 11);
    createPlayerAnimation.call(this, "right", 4, 7);
    createPlayerAnimation.call(this, "down", 0, 3);
    createPlayerAnimation.call(this, "left", 12, 15);
    createPlayerAnimation.call(this, "up-left", 12, 15);
    createPlayerAnimation.call(this, "down-left", 12, 15);
    createPlayerAnimation.call(this, "up-right", 4, 7);
    createPlayerAnimation.call(this, "down-right", 4, 7);

    const gridEngineConfig = {
      characters: [
        {
          id: "eu",
          sprite: playerSprite,
          startPosition: { x: 40, y: 25 },
          charLayer: "playerground",
        },
      ],
      numberOfDirections: 8,
    };

    this.gridEngine.create(map, gridEngineConfig);

    this.gridEngine.movementStarted().subscribe(({ direction }) => {
      playerSprite.anims.play(direction);
      bass.play({ loop: true });
    });

    this.gridEngine.movementStopped().subscribe(({ direction }) => {
      playerSprite.anims.stop();
      playerSprite.setFrame(getStopFrame(direction));
      this.sound.stopAll();
      lastKey = direction;
    });

    this.gridEngine.directionChanged().subscribe(({ direction }) => {
      playerSprite.setFrame(getStopFrame(direction));
      lastKey = direction;
    });

    function createPlayerAnimation(name, startFrame, endFrame) {
      this.anims.create({
        key: name,
        frames: this.anims.generateFrameNumbers("eu", {
          start: startFrame,
          end: endFrame,
        }),
        frameRate: 6,
        repeat: -1,
      });
    }

    function getStopFrame(direction) {
      switch (direction) {
        case "up":
          return 8;
        case "right":
          return 4;
        case "down":
          return 0;
        case "left":
          return 12;
      }
    }
  }

  update() {
    const cursors = this.input.keyboard.createCursorKeys();

    if (cursors.left.isDown && cursors.up.isDown && !ifMove) {
      this.gridEngine.move("eu", "up-left");
    } else if (cursors.left.isDown && cursors.down.isDown && !ifMove) {
      this.gridEngine.move("eu", "down-left");
    } else if (cursors.right.isDown && cursors.up.isDown && !ifMove) {
      this.gridEngine.move("eu", "up-right");
    } else if (cursors.right.isDown && cursors.down.isDown && !ifMove) {
      this.gridEngine.move("eu", "down-right");
    } else if (cursors.left.isDown && !ifMove) {
      this.gridEngine.move("eu", "left");
    } else if (cursors.right.isDown && !ifMove) {
      this.gridEngine.move("eu", "right");
    } else if (cursors.up.isDown && !ifMove) {
      this.gridEngine.move("eu", "up");
    } else if (cursors.down.isDown && !ifMove) {
      this.gridEngine.move("eu", "down");
    }

    let pointerTileX = map.worldToTileX(playerSprite.x);
    let pointerTileY = map.worldToTileY(playerSprite.y);

    if (cursors.space.isDown) {
      let tile = map.getTileAt(pointerTileX, pointerTileY);

      if (tile) {
        if (tile.properties.positionCol === lastKey) {
          if (tile.properties.hasOwnProperty("dialog")) {
            dialogChange(tile.properties.dialog);
          } else {
            switch (tile.properties.type) {
              case "casa":
                console.log("casa");
                break;
              case "biblioteca":
                console.log("biblioteca");
                break;
              default:
                break;
            }
          }
        } else {
          console.log("ntoca");
        }
      }
    }
  }
}
