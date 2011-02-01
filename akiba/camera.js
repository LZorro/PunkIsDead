if (typeof akiba == 'undefined') { akiba = {} }
akiba.camera = {
  // Re-align the camera so that it "follows" the given object.
  //  Uses a "deadzone" if you specify one:
  //  deadzone: 32
  //    OR
  //  deadzone: {
  //    horizontal: 64
  //    vertical:   32
  //  }
  //    OR
  //  deadzone: {
  //    top:    96
  //    bottom: 160
  //    left:   32
  //    right:  32
  //  }
  followObject: function(target, viewdata, options) {
    // the distance from the top/bottom/left/right at which we start panning the camera
    xbufL = 32*8;
    xbufR = 32*8;
    ybufT = 32*3;
    ybufB = 32*5;
    xcam = gbox.getCamera().x; // The current x-coordinate of the camera
    ycam = gbox.getCamera().y; // The current y-coordinate of the camera

    // we want to center the camera on the object
    x = target.x + target.w/2;
    y = target.y + target.h/2;

    if ((x - xcam) > (gbox._screenw - xbufR)) gbox.setCameraX(xcam + (x - xcam) - (gbox._screenw - xbufR), viewdata);
    if ((x - xcam) < (xbufL))                 gbox.setCameraX(xcam + (x - xcam) - xbufL,                   viewdata);
    if ((y - ycam) > (gbox._screenh - ybufB)) gbox.setCameraY(ycam + (y - ycam) - (gbox._screenh - ybufB), viewdata);
    if ((y - ycam) < (ybufT))                 gbox.setCameraY(ycam + (y - ycam) - ybufT,                   viewdata);
  }
}