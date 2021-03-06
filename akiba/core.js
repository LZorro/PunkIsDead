akiba = {
  animation: {
    animation_sets: {
      eight_way_std: {
        makeList: function() {
          return {
            still:     { speed: 1, frames: [0]     },
            right:     { speed: 3, frames: [1, 11] },
            rightDown: { speed: 3, frames: [2, 12] },
            down:      { speed: 3, frames: [3, 13] },
            downLeft:  { speed: 3, frames: [4, 14] },
            left:      { speed: 3, frames: [5, 15] },
            leftUp:    { speed: 3, frames: [6, 16] },
            up:        { speed: 3, frames: [7, 17] },
            upRight:   { speed: 3, frames: [8, 18] }
          }
        },
        startIndex: 'still',
        adjustToVelocity: true
      },

      static_animation: {
        makeList: function() {
          return {
            still: { speed: 8, frames: [0,1] }
          }
        },
        startIndex: 'still',
        adjustToVelocity: false
      }
    },

    makeAnimationList: function(obj, style, startIndex) {
      var adjustToVelocity = this.animation_sets[style].adjustToVelocity;
      obj.animList  = this.animation_sets[style].makeList();
      obj.animIndex = startIndex || this.animation_sets[style].startIndex;

      obj.updateAnimation = function() {
        adjustToVelocity && this.adjustAnimationToVelocity();

        this.otherAnimationUpdates && this.otherAnimationUpdates();

        if (the_game.frameCount % this.animList[this.animIndex].speed == 0) {
          this.frame = help.decideFrame(the_game.frameCount, this.animList[this.animIndex]);
        }
      }

      obj.adjustAnimationToVelocity = function() {
        // this handles different directional animation cases
        // the if statements check for accelerations in the x and y directions and whether they are positive or negative. It then sets the animation index to the keyword corresponding to that direction.-Nick
        if (this.accx == 0 && this.accy == 0) this.animIndex = "still";
        if (this.accx > 0  && this.accy == 0) this.animIndex = "right";
        if (this.accx > 0  && this.accy > 0)  this.animIndex = "rightDown";
        if (this.accx == 0 && this.accy > 0)  this.animIndex = "down";
        if (this.accx < 0  && this.accy > 0)  this.animIndex = "downLeft";
        if (this.accx < 0  && this.accy == 0) this.animIndex = "left";
        if (this.accx < 0  && this.accy < 0)  this.animIndex = "leftUp";
        if (this.accx == 0 && this.accy < 0)  this.animIndex = "up";
        if (this.accx > 0  && this.accy < 0)  this.animIndex = "upRight";
      }
    }
  },

  controls: {
    control_keys: {
      eight_way_std: { left: 'left', right: 'right', up: 'up', down: 'down' },
      eight_way_wasd: { left: 'a', right: 'd', up: 'w', down: 's' }
    },

    setControlKeys: function(obj, style) {
      var my_keys = this.control_keys[style];
      obj.processControlKeys = function() {
        toys.topview.controlKeys(this, my_keys);
      }
    },

    watchKeys: function(mapping) {
      $(window).keydown(function(event) {
        // console.log(event.which);
        var key = akiba.codeToKey[event.which];
        mapping[key] && mapping[key]();
      });
    }
  },

  physics: {
    setPhysics: function(obj, style) {
      obj.applyPhysics = function() {
        // This adds some friction to our accelerations so we stop when we're not accelerating, otherwise our game would control like Asteroids
        toys.topview.handleAccellerations(this);

        // This tells the physics engine to apply those forces
        toys.topview.applyForces(this);
        toys.topview.tileCollision(this, this.game.map, 'map', null, { tollerance: 6, approximation: 3 });
      }
    }
  },

  magic: {
    standard_blit: function() {
      gbox.blitTile(gbox.getBufferContext(), {
        tileset: this.tileset,
        tile:    this.frame,
        dx:      this.x,
        dy:      this.y,
        fliph:   this.fliph,
        flipv:   this.flipv,
        camera:  this.camera,
        alpha:   1.0
      });
    },

    init_topdown: function() {
      help.mergeWithModel(this, {
        x: 0, y: 0, z: 0,
        accx: 0, accy: 0, accz: 0,
        frames        : {},
        shadow        : null,
        maxacc        : 4,
        controlmaxacc : 4,
        responsive    : 0, // Responsiveness
        weapon        : 0, // Weapon
        camera        : true,
        flipv         : false,
        fliph         : false,
        facing        : toys.FACE_DOWN,
        flipside      : true,
        haspushing    : false,
        frame         : 0,
        colh          : gbox.getTiles(this.tileset).tileh,
        colw          : gbox.getTiles(this.tileset).tilew,
        colx          : 0,
        staticspeed   : 0,
        nodiagonals   : false,
        noreset       : false
      });
      if (this.coly==null) this.coly=gbox.getTiles(this.tileset).tileh-this.colh;
      this.colhh=Math.floor(this.colh/2);
      this.colhw=Math.floor(this.colw/2);

      toys.topview.spawn(this);
    },

    init_platformer: function() {
      toys.platformer.initialize(this, {
        frames: {
          still:    { speed: 4, frames:[0] },
          fullLava: { speed: 4, frames:[0] },
          walking:  { speed: 4, frames:[0] },
          jumping:  { speed: 4, frames:[0] },
          falling:  { speed: 4, frames:[0] },
          die:      { speed: 4, frames:[0] }
        },
        x:        this.x,
        y:        this.y,
        jumpaccy: 10,
        side:     true
      });
    }
  }
}

akiba.actors = {
  top_down_object: {
    initialize: akiba.magic.init_topdown,
    blit:       akiba.magic.standard_blit,
    first: function() {
      if (this.processControlKeys) this.processControlKeys();

      this.dealWithMouse && this.dealWithMouse();

      this.updateAnimation && this.updateAnimation();

      this.applyPhysics && this.applyPhysics();
    },

    dealWithMouse: function() {
      if ((typeof g_mouseIsDown !== 'undefined') && g_mouseIsDown) {
        this.whenMouseDown && this.whenMouseDown();
      }
    }
  },

  platformer_object: {
    initialize: akiba.magic.init_topdown,
    blit:       akiba.magic.standard_blit,
    first:      function() {
      this.processControlKeys && this.processControlKeys();

      this.dealWithMouse && this.dealWithMouse();

      this.updateAnimation && this.updateAnimation();

      this.applyPhysics && this.applyPhysics();
    },
  }
}

akiba.keyCode = _($.ui.keyCode).extend({
  A: 65,
  B: 66,
  C: 67,
  D: 68,
  E: 69,
  F: 70,
  G: 71,
  H: 72,
  I: 73,
  J: 74,
  K: 75,
  L: 76,
  M: 77,
  N: 78,
  O: 79,
  P: 80,
  Q: 81,
  R: 82,
  S: 83,
  T: 84,
  U: 85,
  V: 86,
  W: 87,
  X: 88,
  Y: 89,
  Z: 90
});

akiba.codeToKey = _.reduce(akiba.keyCode, function(memo, keyCode, keyLeter) { memo[keyCode] = keyLeter; return memo; }, {});

$aki = akiba;