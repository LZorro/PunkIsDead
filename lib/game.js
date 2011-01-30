var maingame;
var map, foe, yellow_dot;

var bg = new Image();
var isMusicOn = true;
var battle_system;
bg.src = 'images/bg0.png'

function main() {
  // For Tutorial Part 3 we're adding 'background' to the next line.
  // The 'background' rendering group that we'll use for our map, and it will render before anything else because we put it first in this list
  var groups = ['background', 'staticboxes', 'boxes', 'disboxes', 'enemies', 'particles', 'player', 'battle',  'game'];

  gbox.setGroups(groups);

  gbox.setAudioChannels({
    jump:  { volume: 0.1 },
    hit:   { volume: 0.3 },
    boom:  { volume: 0.3 },
    bgmix: { volume: 0.4 },
    bggtr: { volume: 0.4 }
  });

  // Create a new maingame into the "gamecycle" group. Will be called "gamecycle". From now, we've to "override" some of the maingame default actions.
  maingame = gamecycle.createMaingame('game', 'game');

  // Disable the default difficulty-choice menu; we don't need it for our tutorial
  maingame.gameMenu = function() { return true; };

  // Disable the default "get ready" screen; we don't need it for our tutorial
  maingame.gameIntroAnimation = function() { return true; };

  maingame.pressStartIntroAnimation = function() { return true; };

  // Set our intro screen animation
  maingame.gameTitleIntroAnimation = function() { return true; };

  maingame.endlevelIntroAnimation = function(reset) {
       if (reset) {
         toys.resetToy(this,"default-blinker");
      } else {
        return toys.text.blink(this,"default-blinker",gbox.getBufferContext(),{font:"small",text:"WELL DONE!",valign:gbox.ALIGN_MIDDLE,halign:gbox.ALIGN_CENTER,dx:0,dy:0,dw:gbox.getScreenW(),dh:gbox.getScreenH(),blinkspeed:5,times:10});
      }
    };

    // Game ending
    maingame.gameEndingIntroAnimation = function(reset) {
      if (reset) {
        toys.resetToy(this,"default-blinker");
      } else {
          for (var y = 0; y < 30; y++)
            for (var x = 0; x < 40; x++)
              if (game.level[y][x] == '2') help.setTileInMapAtPixel(gbox.getCanvasContext("map_canvas"),map,x*32,y*32,1,"map");
          gbox.getObject('player','player_id').resetGame();
    gbox.blitFade(gbox.getBufferContext(),{alpha:1});
          return toys.TOY_DONE;
      }
    };

    maingame.gameoverIntroAnimation = function(reset) {
       if (reset) {
        gbox.stopChannel("bgmusic");
        toys.resetToy(this,"default-blinker");
      } else {
        return toys.TOY_DONE;
      }
    };

  // This function will be called before the game starts running, so here is where we add our game elements
  maingame.initializeGame = function() {

    // Create the 'player' (see tutorial Part 2 for a detailed explanation)
    addPlayer();

    // Here we create a map object that will draw the map onto the 'background' layer each time our game world is drawn
    addMap();
	
	battle_system = addBattleManager();

    makeFoe('sarah', { x: 200, y: 256 });
    makeFoe('chris', { x: 300, y: 256 });
    makeFoe('joe',   { x: 400, y: 256 });
  };
  map = generateMapObj();
  the_game.map = map;

  // We create a canvas that our map will be drawn to, seting its dimentions by using the map's width and height
  gbox.createCanvas('map_canvas', { w: map.w, h: map.h });

  gbox.createCanvas('bg_canvas', { w: map.w, h: map.h });

  gbox.blitTile(gbox.getCanvasContext('bg_canvas'), {
    tileset: 'city_background',
    tile:    0,
    dx:      0,
    dy:      0,
    fliph:   0,
    flipv:   0,
    camera:  gbox.getCamera(),
    alpha:   1
  });

  // We draw the map onto our 'map_canvas' canvas that we created above.
  // This means that the map's 'blit' function can simply draw the 'map_canvas' to the screen to render the map
  gbox.blitTilemap(gbox.getCanvasContext('map_canvas'), map);

  //play music?
  //if (isMusicOn)
  gbox.playAudio('bgmix', 'bgmix');
  gbox.playAudio('bggtr', 'bggtr');

  var audiolength = gbox.getAudioDuration('bgmix');
  console.log('audio: ' + audiolength);
  var f = gbox.getFps();
  console.log('fps: ' + f);
  //else
    //gbox.stopAudio('bgmix');

  // Now that we've set up our game's elements, this tells the game to run
  gbox.go();
}

// if the object is colliding with another object of a given group (do not count the object we're testing), return the object
// otherwise return false
function collideGroup(obj,group) {
  for (var i in gbox._objects[group])
    if ((!gbox._objects[group][i].initialize)&&gbox.collides(obj,gbox._objects[group][i]))
      if (gbox._objects[group][i] != obj) return gbox._objects[group][i];
  return false;
}

function followCamera(obj, viewdata) {
  // the distance from the top/bottom/left/right at which we start panning the camera
  xbufL = 32*8;
  xbufR = 32*8;
  ybufT = 32*3;
  ybufB = 32*5;
  xcam = gbox.getCamera().x; // The current x-coordinate of the camera
  ycam = gbox.getCamera().y; // The current y-coordinate of the camera

  // we want to center the camera on the object
  x = obj.x + obj.w/2;
  y = obj.y + obj.h/2;

  if ((x - xcam) > (gbox._screenw - xbufR)) gbox.setCameraX(xcam + (x - xcam) - (gbox._screenw - xbufR), viewdata);
  if ((x - xcam) < (xbufL))                 gbox.setCameraX(xcam + (x - xcam) - xbufL,                   viewdata);
  if ((y - ycam) > (gbox._screenh - ybufB)) gbox.setCameraY(ycam + (y - ycam) - (gbox._screenh - ybufB), viewdata);
  if ((y - ycam) < (ybufT))                 gbox.setCameraY(ycam + (y - ycam) - ybufT,                   viewdata);
}

var Game = Klass.extend({
  init: function() {
  }
});

$games = {
  'test_game' : ALESTest
}
