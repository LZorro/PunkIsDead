// This is our function for adding the player object -- this keeps our main game code nice and clean
function addPlayer() {
  return gbox.addObject({
    id:             'player_id',    // id refers to the specific object
    group:          'player',       // The rendering group
    tileset:        'player_tiles', // tileset is where the graphics come from
    starsTotal:     0,
    starsCollected: 0,
    initialized:    false,
    goodNoteState:  false,
    freshNoteState: false,
    diff_threshold: 0.5,
    health:         100,
    power:          0,
    onBox:          false,
    finished:       false,
    frames: {
      still:   { speed: 1, frames: [1] },
      jumping: { speed: 1, frames: [7] },
      walking: { speed: 4, frames: [0, 1, 2, 3, 4, 5] },
      falling: { speed: 1, frames: [6] },
      die:     { speed: 1, frames: [1] },
      pushing: { speed: 6, frames: [8, 9] }
    },
    pushblock: false,

    // the initialize function contains code that is run when the object is first created. In the case of the player object this only
    // happens once, at the beginning of the game, or possibly after a player dies and respawns.
    initialize: function() {
      // And we set the starting position and jump speed for our player.
      this.initialized = true;
      this.x = 43;
      this.y = 262;

      this.spawn = {
        x: this.x,
        y: this.y
      };

      this.originalSpawn = {
        x: this.x,
        y: this.y
      };

      this.jumpaccy     = 10.5; // initial jump vel (size of jump when you tap the jump button)
      this.jumpholdtime = 0.25; // amount of time you can hold the jump, in seconds
      this.jumpaccsusy  = 15.5; // jump vel while holding
      this.jumping      = false; // used by the jumpKeys func
      this.maxaccx      = 7;
      this.maxaccy      = 20;
      this.h            = 58;
      this.w            = 32;
      this.bc           = 0;
      this.prevaccy     = 0;
      this.killed       = false;

      if ($config.has_lives){
        this.lives = 3;
      }

      toys.topview.initialize(this, {});
    },

    first: function() {
      this.prevaccy = this.accy;
      if (this.starsTotal > 0) maingame.hud.setValue("total","value",this.starsTotal-this.starsCollected+" ");

      // Counter, required for setFrame
      this.counter=(this.counter+1)%10;

      // Center the camera on the player object. The map.w and map.h data tells the camera when it's hit the edge of the map so it stops scrolling.
      if (!this.in_battle) {
        akiba.camera.followObject(this, { w: map.w, h: map.h });
      } else {
        gbox.setCamera(0, 0, { w: map.w, h: map.h })
      }

    // *************************************************************************
    // *************************************************************************

      toys.platformer.applyGravity(this); // Apply gravity
      if (!this.in_battle) {
        toys.platformer.horizontalKeys(this, {left: 'left', right: 'right' }); // Moves horizontally
      } else {
        this.accx = 0;
      }
      toys.platformer.horizontalTileCollision(this,map,"map",2); // horizontal tile collision (i.e. walls)
      toys.platformer.verticalTileCollision(this,map,"map",1); // vertical tile collision (i.e. floor)

      if (this.onBox) {
        this.touchedfloor = true;
        this.accy = 0;
        this.y = this.bc + 1;
      }

      toys.platformer.jumpKeys(this, { jump: "a", audiojump: "jump" }); // handle jumping
      if (this.accy < 0) this.onBox = false;
      toys.platformer.handleAccellerations(this); // gravity/attrito

      if (this.pushing == toys.PUSH_LEFT) this.fliph = 1;
        else if (this.pushing == toys.PUSH_RIGHT) this.fliph = 0;

      this.frames.walking.speed = 20/(Math.abs(this.accx));
      toys.platformer.setFrame(this);
      if ((this.pushing == toys.PUSH_LEFT || this.pushing == toys.PUSH_RIGHT) && Math.abs(this.accx) <= 4 && this.touchedfloor) this.frame=help.decideFrame(this.counter,this.frames.pushing);
      if (Math.abs(this.accx) <= 1 && Math.abs(this.accy) <= 1 && this.touchedfloor) this.frame=help.decideFrame(this.counter,this.frames.still);
    },

    // the blit function is what happens during the game's draw cycle. everything related to rendering and drawing goes here
    blit: function() {
      // Render the current sprite.. don't worry too much about what's going on here. We're pretty much doing
      //  the default drawing function, sending along the tileset, the frame info, coordinates, whether the
      //  spries is flipped, camera info, and the alpha transparency value
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

    resetGame: function() {},

    startBattle: function() {
      this.in_battle = true;
    },

    endBattle: function() {
      this.in_battle = false;
    }
  });
}