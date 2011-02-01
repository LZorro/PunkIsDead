// AKIHABARA ENGINE OVERRIDES

// Overriding help.isSquished with a collision fix
help.isSquished = function(th,by) {
  return ((by.accy>0)&&gbox.collides(th,by)&&(Math.abs(th.y-(by.y+by.h))<(by.h)))
};

// Overriding the gravity function to increase the usual gravity (from 1 to 2.5).
toys.platformer.handleAccellerations = function(th) {
  // Gravity
  if (!th.touchedfloor) th.accy += 2.75;
  // Attrito
  if (th.pushing==toys.PUSH_NONE) if (th.accx) th.accx=help.goToZero(th.accx);
};

// overriding toys.platformer.verticalTileCollision to make a four-point collision check
// (topleft, topright, bottomleft, bottomright) instead of a two-point collision check (top-middle, bottom-middle)
toys.platformer.verticalTileCollision = function(th,map,tilemap) {
  var bottomleft=help.getTileInMap(th.x+4,th.y+th.h,map,0,tilemap);
  var topleft=help.getTileInMap(th.x+4,th.y,map,0,tilemap);
  var bottomright=help.getTileInMap(th.x+th.w-4,th.y+th.h,map,0,tilemap);
  var topright=help.getTileInMap(th.x+th.w-4,th.y,map,0,tilemap);
  th.touchedfloor=false;
  th.touchedceil=false;

  if (map.tileIsSolidCeil(th,topleft) || map.tileIsSolidCeil(th,topright)) {
    th.accy=0;
    th.y=help.yPixelToTile(map,th.y,1);
    th.touchedceil=true;
  }

  if (map.tileIsSolidFloor(th,bottomleft) || map.tileIsSolidFloor(th,bottomright)) {
    th.accy=0;
    th.y=help.yPixelToTile(map,th.y+th.h)-th.h;
    th.touchedfloor=true;
  }
};

toys.platformer.horizontalTileCollision = function(th,map,tilemap,precision) {
  var left=0;
  var right=0;
  var t=16;

  th.touchedleftwall=false;
  th.touchedrightwall=false;
  
  while (t<th.h-15) {
    left=help.getTileInMap(th.x,th.y+t,map,0,tilemap);
    right=help.getTileInMap(th.x+th.w-1,th.y+t,map,0,tilemap);
	    
    if ((th.accx<0)&&map.tileIsSolidFloor(th,left)) {
	    th.accx=0;
	    th.x=help.xPixelToTile(map,th.x-1,1);
	    th.touchedleftwall=true;
    } 
    if ((th.accx>0)&&map.tileIsSolidFloor(th,right)) {
	    th.accx=0;
	    th.x=help.xPixelToTile(map,th.x+th.w)-th.w;
	    th.touchedrightwall=true;
    }
    t+=gbox.getTiles(map.tileset).tileh/(precision?precision:1);
  }
};

// overriding toys.platformer.jumpKeys to NOT jump if the player is holding down Ctrl (so you don't jump on Undo)
// also changing the variable-height jump code
toys.platformer.jumpKeys = function(th, key) {
  if (gbox._keyboard[17] != 1) {
    if ((toys.platformer.canJump(th)||(key.doublejump&&(th.accy>=0)))&&gbox.keyIsHit(key.jump)) {
      if (key.audiojump) gbox.hitAudio(key.audiojump);
      th.accy=-th.jumpaccy;
      toys.timer.real(th,'jump',{});
      return true;
    } else if (th.jumpholdtime&&gbox.keyIsHold(key.jump)&&!toys._maketoy(th,'jump')) { // Jump modulation
        if (toys.timer.real(th,'jump',{}) != toys.TOY_DONE) {
            if (th.toys['jump'].realtime < th.jumpholdtime)
                  th.accy=-th.jumpaccsusy;
          }
    } else
      {  
      toys.resetToy(th,'jump');
      }
  }
    return false;  
};

// overriding toys.timer.real to provide a th.toys[id].realtime variable that tells you the time in seconds and milliseconds
toys.timer.real = function(th,id,data) {
			if (toys._maketoy(th,id)) {
				th.toys[id].subtimer=gbox.getFps();
				th.toys[id].done=false;
				if (data.countdown) {
					th.toys[id].time=data.countdown;
          th.toys[id].realtime=data.countdown;
        }
				else {
					th.toys[id].time=0;
          th.toys[id].realtime=0;
        }
			}
			th.toys[id].subtimer--;
      if (data.countdown) th.toys[id].realtime = th.toys[id].time + th.toys[id].subtimer/gbox.getFps();
        else  th.toys[id].realtime = th.toys[id].time + (1 - th.toys[id].subtimer/gbox.getFps());
			
      if (!th.toys[id].subtimer) {
				th.toys[id].subtimer=gbox.getFps();
				if (data.countdown) {
					if (th.toys[id].time) {
						th.toys[id].time--;
            th.toys[id].realtime = th.toys[id].time;
						if (data.audiocritical&&(th.toys[id].time<=data.critical))
							gbox.hitAudio(data.audiocritical);
					} else th.toys[id].done=true;
				} else
					{
            th.toys[id].time++;
            th.toys[id].realtime = th.toys[id].time;
          }
			}
			return toys._toyfrombool(th,id,th.toys[id].done);

		};

// fixing a bug in gbox._keydown where some keys that are set to -1 won't ever register as down
gbox._keydown = function(e) {
  if (!gbox._passKeysThrough && e.preventDefault) e.preventDefault();
  var key=(e.fake||window.event?e.keyCode:e.which);
  gbox._keyboard[key] = 1;
};


gbox.initScreen = function(w, h) {
  document.body.style.textAlign="center";
  document.body.style.height="100%";
  document.body.style.margin="0px";
  document.body.style.padding="0px";
  document.getElementsByTagName("html")[0].style.height="100%";

  var container=document.createElement("div");
  container.style.width="100%";
  container.style.height="100%";
  container.style.display="table";
  this._box=document.createElement("div");
  this._box.style.display="table-cell";
  this._box.style.width="100%";
  this._box.style.textAlign="center";
  this._box.style.verticalAlign="middle";

  this._screen=document.createElement("canvas");
  if (this._border) this._screen.style.border="1px solid black";
  this._screen.setAttribute('height',h);
  this._screen.setAttribute('width',w);
  this._screen.style.width=(w*this._zoom)+"px";
  this._screen.style.height=(h*this._zoom)+"px";
  this._screen.setAttribute('id','aki');
  this._screenh=h;
  this._screenw=w;
  this._screenhh=Math.floor(h/2);
  this._screenhw=Math.floor(w/2);
  this._camera.x=0;
  this._camera.y=0;
  this._camera.h=h;
  this._camera.w=w;
  this._box.appendChild(this._screen);
  container.appendChild(this._box);
  document.getElementById('container').appendChild(container);

  this.createCanvas("_buffer");
  gbox.addEventListener(window,'keydown', this._keydown);
  gbox.addEventListener(window,'keyup', this._keyup);
  if (this._statbar) {
    this._statbar=document.createElement("div");
    if (this._border) this._statbar.style.border="1px solid black";
    this._statbar.style.margin="auto";
    this._statbar.style.backgroundColor="#ffffff";
    this._statbar.style.fontSize="10px";
    this._statbar.style.fontFamily="sans-serif";
    this._statbar.style.width=(w*this._zoom)+"px";
    this._box.appendChild(this._statbar);
  }
  // Keyboard support on devices that needs focus (like iPad) - actually is not working for a bug on WebKit's "focus" command.
  this._keyboardpicker=document.createElement("input");
  this._keyboardpicker.onclick=function(evt) { gbox._hidekeyboardpicker();evt.preventDefault();evt.stopPropagation();};
  this._hidekeyboardpicker(this._keyboardpicker);

  gbox._box.appendChild(this._keyboardpicker);
  gbox._screen.ontouchstart=function(evt) { gbox._screenposition=gbox._domgetabsposition(gbox._screen);if (evt.touches[0].pageY-gbox._screenposition.y<30) gbox._showkeyboardpicker();else gbox._hidekeyboardpicker();evt.preventDefault();evt.stopPropagation();};
  gbox._screen.ontouchend=function(evt) {evt.preventDefault();evt.stopPropagation();};
  gbox._screen.ontouchmove=function(evt) { evt.preventDefault();evt.stopPropagation();};
  gbox._screen.onmousedown=function(evt) {gbox._screenposition=gbox._domgetabsposition(gbox._screen);if (evt.pageY-gbox._screenposition.y<30)  gbox._showkeyboardpicker(); else gbox._hidekeyboardpicker();evt.preventDefault();evt.stopPropagation();};

  var d=new Date();
  gbox._sessioncache=d.getDate()+"-"+d.getMonth()+"-"+d.getFullYear()+"-"+d.getHours()+"-"+d.getMinutes()+"-"+d.getSeconds();

  gbox._loadsettings(); // Load default configuration
  gbox.setCanAudio($config.use_audio); // Tries to enable audio by default

  switch (gbox._flags.fse) { // Initialize FSEs
    case "scanlines": {
      gbox.createCanvas("-gbox-fse",{w:w,h:h});
      gbox.getCanvasContext("-gbox-fse").save();
      gbox.getCanvasContext("-gbox-fse").globalAlpha=0.2;
      gbox.getCanvasContext("-gbox-fse").fillStyle = gbox.COLOR_BLACK;
      for (var j=0;j<h;j+=2)
        gbox.getCanvasContext("-gbox-fse").fillRect(0,j,w,1);
      gbox.getCanvasContext("-gbox-fse").restore();
      gbox._localflags.fse=true;
      break;
    }
    case "lcd":{
      gbox.createCanvas("-gbox-fse-old",{w:w,h:h});
      gbox.createCanvas("-gbox-fse-new",{w:w,h:h});
      gbox._localflags.fse=true;
      break;
    }
  }
};

help.geturlparameter = getURLParam;


/**
* Sets the x and y value of the current camera object.
* @param {Integer} x The camera object's new x value.
* @param {Integer} y The camera object's new y value.
* @param {Object} viewdata An object containing parameters h and w, which are a bounding box that the camera is
* not supposed to leave. For example, to use your map as a bounding area for the camera, pass along {w: map.w, h: map.h}.
*/
gbox.setCamera = function(x, y, viewdata) {
	gbox.setCameraX(x, viewdata);
	gbox.setCameraY(y, viewdata);
}