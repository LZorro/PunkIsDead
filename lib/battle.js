// This is our function for adding the player object -- this keeps our main game code nice and clean
function addBattleManager() {
  return gbox.addObject({
    id:             'battle_id',    // id refers to the specific object
    group:          'battle',       // The rendering group
    tileset:        'player_tiles', // tileset is where the graphics come from
	songLength:		0,
	timer: 			0,
	goodNoteState: 	false,
	freshNoteState:	false,
	currentNote: 	2,
	diff_threshold:	0.5,
	player_health:	100,
	player_power:	0,
	enemy_health:	100,
	enemy_power:	0,
	total_attacks:	1,
	total_defends:	1,
	game_over:		false,

    // the initialize function contains code that is run when the object is first created. In the case of the player object this only
    // happens once, at the beginning of the game, or possibly after a player dies and respawns.
    initialize: function() {
		
		// initialize timer
		this.songLength = gbox.getAudioDuration('bgmix') * gbox.getFps();
		this.timer = this.songLength;
		console.log('timer: ' + this.timer);
		console.log('notes: ' + level_data.length);
		
		total_attacks = level_data[0][0];
		
		total_defends = level_data[1][0];
		this.enemy_power = (100 * this.diff_threshold)/total_defends;
    },

    // The 'first' function is like a step function. Tt runs every frame and does calculations. It's called 'first'
    //  because it happens before the rendering, so we calculate new positions and actions and THEN render them
    first: function() {
      
		// *************************************************************************		  
		// *************************************************************************
		// calculating timer
		if (this.timer > 0)
		{
			this.timer--;
			var time_index = level_data[this.currentNote][0];
      // console.log(this.timer + ' / ' + this.currentNote + ' : ' + level_data[this.currentNote]);
			time_index = this.songLength - (time_index * gbox.getFps());
			// We are expecting an event (button press, Attack, Defend) within a certain time window
			if (this.timer < time_index && this.timer > (time_index-(this.diff_threshold*gbox.getFps())))
			{	
				// if we receive a message to attack, damage the enemy and reset power
				if (level_data[this.currentNote][1] == "attack")
				{
					this.enemy_health = this.enemy_health - (this.player_power/this.total_attacks);
					//console.log(this.currentNote + ' ATTACK with power ' + this.player_power);
					//console.log('Player: ' + this.player_health + ' / Enemy: ' + this.enemy_health);
					this.currentNote++;
					this.player_power = 0;
				}
				// else if data says to 'defend', take damage
				else if (level_data[this.currentNote][1] == "defend")
				{
					this.player_health = this.player_health - this.enemy_power; 
					//console.log(this.currentNote + ' DEFEND - enemy power: ' + this.enemy_power);
					//console.log('Player: ' + this.player_health + ' / Enemy: ' + this.enemy_health);
					this.currentNote++;
				}
				// else record keystrokes
				else
				{
					this.goodNoteState = true;
					this.freshNoteState = true;
					
					//console.log(this.currentNote + ' Press NOW: ' + level_data[this.currentNote][1]);
				}
			}
			else
			// otherwise, advance so we're looking for the next event
			{
				this.goodNoteState = false;
				if (this.freshNoteState)
				{
					if (this.currentNote < level_data.length-2)
						this.currentNote++;
					this.freshNoteState = false;
				}
			}
		}
		else
		{
			// game timer has expired; determine winner
			if (!this.game_over)
			{
				console.log('FINAL: Player: ' + this.player_health + ' / Enemy: ' + this.enemy_health);
				if (this.player_health > this.enemy_health)
					console.log('YOU A WINNAH! HAHAHA!');
				else
					console.log('You fail at this game, and at life.');
				this.game_over = true;
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
	
	input: function(pressedKey) {
		// *************************************************************************
		// *************************************************************************
		//if (gbox.keyIsHit("b")) {
			//console.log(this.timer + ' : NoteState: ' + this.goodNoteState);
			//isMusicOn = !isMusicOn;
			if (this.goodNoteState)// && level_data[this.currentNote][1] == "x") // add this part to check for specific keys
			{
				console.log('Guitars ON');
				gbox.setAudioUnmute('bggtr');
				this.player_power = this.player_power + 10;
			}
			else
			{
				console.log('Guitars OFF');
				gbox.setAudioMute('bggtr');
			}
		//}

		//if (gbox.keyIsHit("c")) {
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
		//}
	},
  });
}