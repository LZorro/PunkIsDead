var maingame;
var map, foe, yellow_dot;

var bg = new Image();
var isMusicOn = true;
var battle_system;
bg.src = 'images/bg0.png'

function main() {

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
  'punk_is_dead' : PunkIsDead
}