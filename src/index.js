import * as PIXI from 'pixi.js'
import Map1 from './staticMaps/1';

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
  const sheet = resources.tiles.spritesheet
  const emptyTile = new PIXI.Sprite(sheet.textures['tile.png']);

  // Setup the position of the emptyTile
  emptyTile.x = app.renderer.width / 2;
  emptyTile.y = app.renderer.height / 2;

  // Rotate around the center
  emptyTile.anchor.x = 0.5;
  emptyTile.anchor.y = 0.5;

  // Add the emptyTile to the scene we are building
  app.stage.addChild(emptyTile);
});