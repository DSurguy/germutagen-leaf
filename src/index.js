import * as PIXI from 'pixi.js'
import map1 from './staticMaps/1';
import Keyboard from './keyboard.js'

const framesets = {}

function initStatics(){
  buildFramesets();
}

function initInterface(){
  const thisKeyboard = new Keyboard();
  thisKeyboard.getKey('ArrowUp').on("keydown", () => console.log("Moving Up"))
  thisKeyboard.getKey('ArrowDown').on("keydown", () => console.log("Moving Down"))
  thisKeyboard.getKey('ArrowLeft').on("keydown", () => console.log("Moving Left"))
  thisKeyboard.getKey('ArrowRight').on("keydown", () => console.log("Moving Right"))
}

function transformMapIntoStage(mapTiles, stage, resources){
  const sheet = resources.tiles.spritesheet;
  const mapWidth = mapTiles[0].length;
  const mapHeight = mapTiles.length;
  const center = {
    x: app.renderer.width / 2,
    y: app.renderer.height / 2
  }
  const tileSize = 32;
  //Store an offset if we have an odd number of tiles
  const centerOffset = {
    x: () => {
      return -(mapWidth*tileSize)/2
    },
    y: () => {
      return -(mapHeight*tileSize)/2
    }
  }
  
  for( let row = 0; row<mapHeight; row++ ){
    for( let col = 0; col<mapWidth; col++ ){

      const gridTile = getGridTileSprite(mapTiles[row][col], sheet)
      gridTile.x = center.x;
      gridTile.y = center.y;
      //apply offset based on position in grid
      gridTile.x += col*tileSize;
      gridTile.y += row*tileSize;
      //apply offset based on center
      gridTile.x += centerOffset.x()
      gridTile.y += centerOffset.y()

      stage.addChild(gridTile);
    }
  }
}

function getGridTileSprite(tileType, spritesheet) {
  switch( tileType ){
    case '=': return new PIXI.Sprite(spritesheet.textures[getFrame('tiles', 'wall')]);
    case '1': return new PIXI.Sprite(spritesheet.textures[getFrame('tiles', 'blue-slot-fill')]);
    case '2': return new PIXI.Sprite(spritesheet.textures[getFrame('tiles', 'green-slot-fill')]);
    case '3': return new PIXI.Sprite(spritesheet.textures[getFrame('tiles', 'purple-slot-fill')]);
    case '4': return new PIXI.Sprite(spritesheet.textures[getFrame('tiles', 'orange-slot-fill')]);
    case 'o':
    default: return new PIXI.Sprite(spritesheet.textures[getFrame('tiles', 'tile')]);
  }
}

const tilesFrames = [
  'wall',
  'tile',
  'orange-slot',
  'blue-slot',
  'purple-slot',
  'green-slot',
  'orange-slot-fill',
  'blue-slot-fill',
  'purple-slot-fill',
  'green-slot-fill',
  'teal-orb',
  'red-orb',
  'purple-orb',
  'gray-orb',
  'yellow-orb'
]

function buildFramesets(){
  framesets.tiles = tilesFrames.reduce((map, frame, frameIndex) => {
    map[frame] = frameIndex
    return map
  }, {})
}

function getFrame(frameset, framename) {
  return `${frameset}${framesets[frameset][framename]}.png`
}

function move(){
  
}

/**
 *  RUNTIME
 */
initStatics();
initInterface();
// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
const app = new PIXI.Application();

// The application will create a canvas element for you that you
// can then insert into the DOM
document.body.appendChild(app.view);

// load the texture we need
app.loader
.add('tiles', './assets/tiles.json')
.load((loader, resources) => {
  transformMapIntoStage(map1.tiles, app.stage, resources)

  app.ticker.add(function(delta) {
    
  });
});