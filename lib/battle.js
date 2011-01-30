// This is our function for adding the player object -- this keeps our main game code nice and clean
function addBattleManager() {
  gbox.addObject({
    id:             'battle_id',    // id refers to the specific object
    group:          'battle',       // The rendering group
    tileset:        'player_tiles', // tileset is where the graphics come from
	songLength:		0,
	timer: 			0,
	goodNoteState: 	false,
	freshNoteState:	false,
	currentNote: 	0,
	diff_threshold:	0.5,
	health:			100,
	power:			0,

    // the initialize function contains code that is run when the object is first created. In the case of the player object this only
    // happens once, at the beginning of the game, or possibly after a player dies and respawns.
    initialize: function() {
		
		// initialize timer
		this.songLength = gbox.getAudioDuration('bgmix') * gbox.getFps();
		this.timer = this.songLength;
		console.log('timer: ' + this.timer);
    },

    // The 'first' function is like a step function. Tt runs every frame and does calculations. It's called 'first'
    //  because it happens before the rendering, so we calculate new positions and actions and THEN render them
    first: function() {
      
		// *************************************************************************
		// *************************************************************************
		if (gbox.keyIsHit("b")) {
			//console.log(this.timer + ' : NoteState: ' + this.goodNoteState);
			//isMusicOn = !isMusicOn;
			if (this.goodNoteState)// && level_data[this.currentNote][1] == "x") // add this part to check for specific keys
			{
				console.log('Guitars ON');
				gbox.setAudioUnmute('bggtr');
				this.power = this.power + 10;
			}
			else
			{
				console.log('Guitars OFF');
				gbox.setAudioMute('bggtr');
			}
		}

		if (gbox.keyIsHit("c")) {
			/* // add this section to check for another key
			isMusicOn = !isMusicOn;
			if (this.goodNoteState && level_data[this.currentNote][1] == "c")
			{
			console.log('Guitars ON');
			gbox.setAudioUnmute('bggtr');
			}
			else
			{
			console.log('Guitars OFF');
			gbox.setAudioMute('bggtr');
			}*/
		}

     
		// *************************************************************************		  
		// *************************************************************************
		// calculating timer
		this.timer--;
		if (this.timer > 0)
		{
			var time_index = level_data[this.currentNote][0];
			time_index = this.songLength - (time_index * gbox.getFps());
			if (this.timer < time_index && this.timer > (time_index-(this.diff_threshold*gbox.getFps())))
			{	
				// if we receive a message to attack, damage the enemy and reset power
				if (level_data[this.currentNote][1] == "attack")
				{
					console.log('ATTACK with power ' + this.power);
					// TODO: send a message to the enemy to reduce its health by this.power
					this.currentNote++;
					this.power = 0;
				}
				// else if data says to 'defend', take damage
				else if (level_data[this.currentNote][1] == "defend")
				{
					this.health = this.health - 10; //** TODO: replace this with the enemy's power **
					console.log('DEFEND - health left: ' + this.health);
					this.currentNote++;
				}
				// else record keystrokes
				else
				{
					this.goodNoteState = true;
					this.freshNoteState = true;
					
					console.log('Press NOW: ' + level_data[this.currentNote][1]);
				}
			}
			else
			{
				this.goodNoteState = false;
				if (this.freshNoteState)
				{
					this.currentNote++;
					this.freshNoteState = false;
				}
			}
		}
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
  });
}