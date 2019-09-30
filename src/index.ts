import * as PIXI from 'pixi.js'
import map1 from './staticMaps/1';
import { sharedKeyboard } from './keyboard/keyboard'
import generateMapRooms from 'dungeon/generateMapRooms';

const baseTileProperties = {
  passable: true
}
const tileProperties = {
  '=': Object.assign({}, baseTileProperties, {passable: false}),
  '1': Object.assign({}, baseTileProperties),
  '2': Object.assign({}, baseTileProperties),
  '3': Object.assign({}, baseTileProperties),
  '4': Object.assign({}, baseTileProperties),
  'o': Object.assign({}, baseTileProperties)
}

const framesets = {
  tiles: undefined as any
}
const player = {
  position: {
    x: 7,
    y: 2
  },
  lastPosition: undefined as any,
  sprite: undefined as any
}
let currentMap = map1.tiles;

function initStatics(){
  console.log(generateMapRooms(120, 200));
  buildFramesets();
}

function initInterface(){
  sharedKeyboard.getKey('ArrowUp').on("keydown", (e, keyHandlerState) => { movePlayer('up'); console.log("Moving Up") } )
  sharedKeyboard.getKey('ArrowDown').on("keydown", (e, keyHandlerState) => { movePlayer('down'); console.log("Moving Down") } )
  sharedKeyboard.getKey('ArrowLeft').on("keydown", (e, keyHandlerState) => { movePlayer('left'); console.log("Moving Left") } )
  sharedKeyboard.getKey('ArrowRight').on("keydown", (e, keyHandlerState) => { movePlayer('right'); console.log("Moving Right") } )
}

function positionWithOffset(objectToPosition, point){
  const center = {
    x: app.renderer.width / 2,
    y: app.renderer.height / 2
  }
  const tileSize = 32;
  //Store an offset if we have an odd number of tiles
  const centerOffset = {
    x: () => {
      return -(currentMap[0].length*tileSize)/2
    },
    y: () => {
      return -(currentMap.length*tileSize)/2
    }
  }
  const newPosition = {
    x: center.x,
    y: center.y
  }

  //apply offset based on position in grid
  newPosition.x += point.x*tileSize;
  newPosition.y += point.y*tileSize;
  //apply offset based on center
  newPosition.x += centerOffset.x()
  newPosition.y += centerOffset.y()
  objectToPosition.x = newPosition.x;
  objectToPosition.y = newPosition.y;
}

function transformCurrentMapIntoStage(stage, resources){
  const sheet = resources.tiles.spritesheet;
  const mapWidth = currentMap[0].length;
  const mapHeight = currentMap.length;
  
  for( let row = 0; row<mapHeight; row++ ){
    for( let col = 0; col<mapWidth; col++ ){

      const gridTile = getGridTileSprite(currentMap[row][col], sheet)
      positionWithOffset(
        gridTile,
        {
          x: col,
          y: row
        }
      )

      stage.addChild(gridTile);
    }
  }
}

function addPlayerSprite(stage, resources){
  player.sprite = new PIXI.Sprite(resources.tiles.spritesheet.textures[getFrame('tiles', 'player')]);
  positionWithOffset(
    player.sprite,
    player.position
  )
  stage.addChild(player.sprite)
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
  'yellow-orb',
  'player'
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

function movePlayer(direction){
  const newPosition = Object.assign({}, player.position)
  switch(direction){
    case "left": newPosition.x -= 1; break;
    case "right": newPosition.x += 1; break;
    case "up": newPosition.y -= 1; break;
    case "down": newPosition.y += 1; break;
  }
  //get the tile at the new position and see if it's passable
  let newTile = map1.tiles[newPosition.y] ? map1.tiles[newPosition.y][newPosition.x] : null;
  if( newTile && (!tileProperties[newTile] || tileProperties[newTile].passable) ){
    //move, it's passable
    player.lastPosition = player.position;
    player.position = newPosition;
    positionWithOffset(
      player.sprite,
      player.position
    )
    console.log(player.sprite.x);
  }
  else{
    //impassable
    return false;
  }
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
  transformCurrentMapIntoStage(app.stage, resources)
  addPlayerSprite(app.stage, resources)

  app.ticker.add(function(delta) {
    app.renderer.render(app.stage);
  });
});