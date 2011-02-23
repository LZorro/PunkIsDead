battle_manager = {
  id:             'battle_id',    // id refers to the specific object
  group:          'battle',       // The rendering group
  tileset:        'player_tiles', // tileset is where the graphics come from
  songLength:     0,
  timer:          0,
  battle_start_time: 0,
  now_time:		  0,
  goodNoteState:  false,
  freshNoteState: false,
  currentNote:    0,
  diff_threshold: 500,  // how long in ms you have to press the button
  player_health:  100,
  player_power:   0,
  enemy_health:   100,
  enemy_power:    0,
  total_attacks:  1,
  total_defends:  1,
  game_over:      false,
  printme:        true,
  running:        false,
  successFunc:    function() { /*console.log('empty success function');*/ },
  failureFunc:    function() { /*console.log('empty failure function');*/ },
  endPlayerFunc:  function() { /*console.log('received end_player event');*/ },
  endEnemyFunc:   function() { /*console.log('received end_enemy event');*/ },

  // the initialize function contains code that is run when the object is first created. In the case of the player object this only
  // happens once, at the beginning of the game, or possibly after a player dies and respawns.
  initialize: function() {

    // HACK
    this.song_data = level_data;

//    this.total_attacks = this.song_data[0][0];
//    this.total_defends = this.song_data[1][0];

//    this.enemy_power = (100 * this.diff_threshold)/this.total_defends;
	this.enemy_power = 10;
	
	// this is an attempt of getting keyboard control during a battle
	
	$aki.controls.watchKeys({
      Z: function() {
		battle_manager.input('z');
		//console.log('Z pressed');
      },
      X: function() {
		battle_manager.input('x');
        //console.log('X pressed');
      },
      C: function() {
		battle_manager.input('c');
        //console.log('C pressed');
      },
      V: function() {
		battle_manager.input('v');
        //console.log('V pressed');
      }
    });
	

  },

  first: function() {
    if (!this.running) { return; }

    // *************************************************************************
    // *************************************************************************
    // calculating timer
	var msec_passed;
	
    if (this.timer < this.songLength)
    {
	  // add in the number of milliseconds since the last 'frame' into the timer
      if (this.timer == 0) 
	  {
	    this.now_time = new Date().getTime();
		msec_passed = this.now_time - this.battle_start_time;
	  }
	  else
	  {
	  	msec_passed = new Date().getTime() - this.now_time;
		this.now_time = this.now_time + msec_passed;
	  }
	  this.timer = this.timer + msec_passed;
	  
	  // calculate the next expected event
      var time_index = this.song_data[this.currentNote][0] * 1000;

	  if (this.song_data[this.currentNote][1] == "end_player")
	  {
		// if we receive a message to attack, damage the enemy and reset power
		this.endPlayerFunc();
		
		// this most likely has to go in the function above
		this.enemy_health = this.enemy_health - (this.player_power/this.total_attacks);
        //console.log(this.currentNote + ' ATTACK with power ' + this.player_power);
        //console.log('Player: ' + this.player_health + ' / Enemy: ' + this.enemy_health);
        this.currentNote++;
		//this.player_power = 0;
	  }
	  else if (this.song_data[this.currentNote][1] == "end_enemy")
	  {
		// else if data says to 'defend', take damage
		this.endEnemyFunc();
		
		// most likely goes in the above function
		this.player_health = this.player_health - this.enemy_power;
        //console.log(this.currentNote + ' DEFEND - enemy power: ' + this.enemy_power);
        //console.log('Player: ' + this.player_health + ' / Enemy: ' + this.enemy_health);
        this.currentNote++;
	  }
	  else
	  {
		// We are expecting a button press within a certain time window
		// turn on the 'listener' toggle
		if (this.timer > time_index && this.timer < (time_index+this.diff_threshold))
		{
			//console.log('EXPECTING BUTTON ' + this.song_data[this.currentNote][1]);
			this.goodNoteState = true;
			this.freshNoteState = true;
        }
		else
		{
			this.goodNoteState = false;
			// once the window has passed, advance to the next expected note
			if (this.freshNoteState)
			{
				this.freshNoteState = false;
				if (this.currentNote < this.song_data.length)
					this.currentNote++;
			}
			
		}
      }
  
    } else {
      // game timer has expired; determine winner
      if (!this.game_over) {
        console.log('FINAL: Player: ' + this.player_health + ' / Enemy: ' + this.enemy_health);
        if (this.player_health > this.enemy_health)
          console.log('YOU A WINNAH! HAHAHA!');
        else
          console.log('You fail at this game, and at life.');
        this.game_over = true;
      }
    }
  },

  blit: function() {},

  start: function() {
    this.songLength = gbox.getAudioDuration('bgmix') * 1000;
    this.timer = 0; //this.songLength;
	this.currentNote = 0;
	this.battle_start_time = new Date().getTime();
	this.dummy = 0;

    console.log('Song length (ms): ', this.songLength);

    this.running = true;
  },

  end: function() {
    this.running = false;
  },

  input: function(pressedKey) {
    // *************************************************************************
    // *************************************************************************
	if (this.running) {
	  // if the expecting-button-press window is open, and the right button was pressed...
	  if (this.goodNoteState && this.song_data[this.currentNote][1] == pressedKey) 
      {
		// successful button press, turn on music
        //console.log('Guitars ON');
        this.successFunc({
          powerLevel: this.player_power
        });
        gbox.setAudioUnmute('bggtr');
        //this.player_power = this.player_power + 10;
      }
      else
      {
		// otherwise, wrong button or wrong time; music off, error noise
        //console.log('Guitars OFF');
        this.failureFunc();
        gbox.setAudioMute('bggtr');
      }
	}
  }
}

function addBattleManager() {
  return gbox.addObject(battle_manager);
}