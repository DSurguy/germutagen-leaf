import { getRandomIntInclusive } from 'utils/random';
import { applyMinimum } from 'utils/math';

interface StalkGenerationOptions {
  mapWidth: number, 
  mapHeight: number
}

export default function generateMapRooms(width: number, height: number){
  //Exercise Constraints
  if( width < 10 || height < 10 ){ throw new Error(`Provided map size ${width}x${height} is too small to generate anything meaningful.`)}
  //generate the stalk
  const stalk = generateStalk({
    mapWidth: width, 
    mapHeight: height
  })
  return stalk;
}

// Rules: ~/docs/stalk.md
function generateStalk(options: StalkGenerationOptions): Array<Map.Room>{
  const minimumChunkWidth = 4;
  const minimumChunkHeight = 5;
  //Based on maxHeight, decide on the height of the stalk (50-90% of the available space)
  const stalkHeight = getRandomIntInclusive(Math.floor(options.mapHeight*0.9), Math.floor(options.mapHeight*0.5))
  //Portion the stalk into chunks, based on the minimum chunk size of 4x5
  const chunks = [] as Array<{
    height: number;
    width: number;
  }>;
  let stalkRemaining = stalkHeight;
  while(stalkRemaining > minimumChunkHeight){
    //Choose a height based on:
    // - 80-100% previous chunk
    // - 20% full stalk
    // - Min chunk height
    let currentChunkHeight = applyMinimum(
      chunks[chunks.length-1] 
        ? getRandomIntInclusive(chunks[chunks.length-1].height, Math.floor(chunks[chunks.length-1].height*0.8)) 
        : Math.floor(stalkHeight*0.2),
      minimumChunkHeight
    );
    if( currentChunkHeight > stalkRemaining ) currentChunkHeight = stalkRemaining; //Is this necessary?

    //Decide on a width, no more than 10% of the map width, between 80-100% of the previous chunk
    let currentChunkWidth = applyMinimum(
      chunks[chunks.length-1] 
        ? getRandomIntInclusive(chunks[chunks.length-1].width, Math.floor(chunks[chunks.length-1].width*0.8)) 
        : Math.floor(options.mapWidth*0.1),
        minimumChunkWidth
    );

    chunks.push({
      width: currentChunkWidth,
      height: currentChunkHeight
    })
    stalkRemaining -= currentChunkHeight;
  }
  //if we have remaining stalk, just add it to the first room
  chunks[0].height += stalkRemaining;
  console.log(chunks);
  
  //Start at the center bottom of the map
  let currentPosition = {
    y: options.mapHeight-1,
    x: Math.floor((options.mapWidth-1)/2)
  } as Map.Point;

  //Move up to 10% off of the bottom
  const bottomOffset = getRandomIntInclusive(Math.ceil(currentPosition.y/10));
  currentPosition.y -= bottomOffset;
  
  //Draw chunks, offsetting them on alternating sides
  const chunkRooms = [];
  const enum chunkOffset {
    left,
    right,
    center
  }
  //draw the first chunk
  chunkRooms.push({
    x: currentPosition.x - Math.floor(chunks[0].width/2),
    y: currentPosition.y - chunks[0].height,
    width: chunks[0].width,
    height: chunks[0].height
  })
  let offsetDirection = getRandomIntInclusive(chunkOffset.right, chunkOffset.left);
  for( let i=1; i<chunks.length; i++ ){
    
  }

  return chunkRooms;
}