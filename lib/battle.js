battle_manager = {
  id:             'battle_id',    // id refers to the specific object
  group:          'battle',       // The rendering group
  tileset:        'player_tiles', // tileset is where the graphics come from
  songLength:     0,
  timer:          0,
  goodNoteState:  false,
  freshNoteState: false,
  messageState:   false,
  currentNote:    2,
  diff_threshold: 0.5,
  player_health:  100,
  player_power:   0,
  enemy_health:   100,
  enemy_power:    0,
  total_attacks:  1,
  total_defends:  1,
  game_over:      false,
  launch_index:   0,
  printme:        true,

  // the initialize function contains code that is run when the object is first created. In the case of the player object this only
  // happens once, at the beginning of the game, or possibly after a player dies and respawns.
  initialize: function() {

    // initialize timer
    this.songLength = gbox.getAudioDuration('bgmix') * gbox.getFps();
    this.timer = this.songLength;
    //console.log('timer: ' + this.timer);
    //console.log('notes: ' + level_data.length);

    this.total_attacks = level_data[0][0];

    this.total_defends = level_data[1][0];
    this.enemy_power = (100 * this.diff_threshold)/this.total_defends;

    this.launch_index = this.timer-1;
  },

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

      this.launch_index = this.songLength - (level_data[this.currentNote][0] - 2.0) * gbox.getFps();
      //this.launch_index = this.songLength - (this.launch_index * gbox.getFps());

      //console.log(this.currentNote + ' / ' + this.timer + ' : ' + this.launch_index);

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
          this.messageState = true;

          //console.log(this.currentNote + ' Press NOW: ' + level_data[this.currentNote][1]);
        }
      }

      // if there is a launch due, launch it
      if (this.timer == this.launch_index)// && this.timer > this.launch_index-5)
      {
        // send a message to the Battle Screen to start the next button animation
        //console.log('Launching ' + this.launch_index);
        this.messageState = true;
      }

      // otherwise, advance so we're looking for the next event
      if (this.messageState)
      {
        this.messageState = false;
        this.goodNoteState = false;
        if (this.freshNoteState)
        {
          if (this.currentNote < level_data.length-2)
          {
            this.currentNote++;
          }
          this.freshNoteState = false;
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
  }
}

function addBattleManager() {
  return gbox.addObject(battle_manager);
}