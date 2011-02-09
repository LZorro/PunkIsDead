var g_notes = [];

var Screen = Klass.extend({
  init: function(options) {
    if (!options) options = {};

    this.game = the_game;
    _(this).extend(options);

    this.aki_attributes = _.extend({
      group: 'fights',
      blit: function() {
        if (this.actor.visible()) { akiba.magic.standard_blit.call(this); }
      },
      actor: this
    }, options.aki_attributes || {});

    this.aki_obj = createTopDown(this.aki_attributes);

    this.id = this.aki_attributes.id;
    this.name = this.name || this.id;
  },

  aki: function() {
    return this.aki_obj;
  }
});

var GameScreen = Screen.extend({
  visible: function() {
    return this.game.currentScreen === this.name;
  }
});

var Button = Klass.extend({
  init: function(options) {
    if (!options) options = {};

    this.game = the_game;
    _(this).extend(options);

    this.aki_attributes = _.extend({
      group:   'buttons'
    }, options.aki_attributes || {});

    this.aki_obj = createTopDown(this.aki_attributes);

    this.id = this.aki_attributes.id;
  },

  aki: function() {
    return this.aki_obj;
  }
});

var Note = Button.extend({
  init: function(options) {
    if (!options) options = {};

    this._super(options);
    this.startTime = new Date().getTime();
    var that = this;

    _.extend(this.aki_obj, {
      tileset: 'button_' + options.type,
      missed:  false,
      updateAnimation: function() {
        var msec_passed = new Date().getTime() - that.startTime;
        // console.log(msec_passed);
        this.x = 30 + (MAGIC_TIME - msec_passed)/5;
        if (msec_passed >= MAGIC_TIME) {
          gbox.trashObject(this);
          g_notes = _(g_notes).without(this);
        } else if (msec_passed >= (MAGIC_TIME - 300)) {
          if (!this.missed) {
            this.missed = true;
            this.tileset = 'button_miss';
          }
        }
      }
    });
  }
});

var Battle = Klass.extend({
  init: function(options) {
    if (!options) options = {};

    this.foe = options.foe;
    this.noteQueue = [];
    this.powerLevel = 0;
  },

  start: function() {
    the_game.startBattle(this);
    the_game.changeScreen(this.foe.fight_screen.name);

    this.playNotes();

    gbox.playAudio('bgmix', 'bgmix');
    gbox.playAudio('bggtr', 'bggtr');
    battle_manager.successFunc = $.proxy(function(data) {
      this.updateDecibelMeter(data.powerLevel);
    }, this);
    battle_manager.start();
  },

  end: function() {
    gbox.stopAudio('bgmix');
    gbox.stopAudio('bggtr');
    the_game.endBattle();
    _(g_notes).each(function(note) { gbox.trashObject(note); });
    _(this.noteQueue).each(function(timeout) { clearTimeout(timeout); });
    battle_manager.end();
  },

  updateDecibelMeter: function(power_level) {
    var num_power_bars = Math.floor(power_level/10);
    this.powerLevel = num_power_bars;
  },

  playNotes: function() {
    _(battle_manager.song_data).each(_.bind(function(note) {
      var note_letter = note[1], note_seconds_into_song = note[0];
      if (_(['c', 'v', 'z', 'x']).include(note_letter)) {
        this.noteQueue.push(setTimeout("spawnNote('" + note_letter + "', {})", note_seconds_into_song * 1000));
      }
      // debug.log(note[0], note_letter);
    }, this));
  }
});

MAGIC_TIME = 3300 //1900
var num = 1;
function spawnNote(type, options) {
  the_game.button_c = new Note({
    type: type
  });

  var a_button_c = the_game.button_c.aki();

  var note_top = 355;
  var inc = 28;
  if (type === 'z') {
    a_button_c.y = note_top;
  } else if (type === 'x') {
    a_button_c.y = note_top + inc;
  } else if (type === 'c') {
    a_button_c.y = note_top + inc*2;
  } else if (type === 'v') {
    a_button_c.y = note_top + inc*3;
  }
  a_button_c.x = 100;
  a_button_c.id = 'button_' + type + num++;

  g_notes.push(a_button_c);
  gbox.addObject(a_button_c);
}

function makeFightScreen(name, options) {
  if (!options) options = {}

  var fight_screen = new GameScreen({
    aki_attributes: {
      id:      options.id      || 'fight_' + name,
      tileset: options.tileset || 'fight_background_' + name
    },
    name: name,
    foe:  the_game.foes[name]
  });

  fight_screen.enemy_decibel_meter = createTopDown({
    id:      'fight_screen_decibel_meter_' + name,
    fight:   fight_screen,
    tileset: 'decibel_meter_' + name,
    group:   'buttons',
    x: 205,
    y: 0,
    blit: function() {
      if (this.fight.visible()) {
        akiba.magic.standard_blit.call(this);

        // gbox.blitRect(gbox.getBufferContext(), {
        //   x: 260,
        //   y: 285 - 80,
        //   w: 120,
        //   h: 80,
        //   color: 'rgb(34,255,4)'
        // });
      }
    }
  });
  gbox.addObject(fight_screen.enemy_decibel_meter);

  fight_screen.enemy_decibel_bars = [];
  _(_.range(1, 8)).each(function(bar_i) {
    fight_screen.enemy_decibel_bars.push(createTopDown({
      id:      'fight_screen_decibel_meter_' + name + '_num_' + bar_i,
      fight:   fight_screen,
      tileset: 'decibel_meter_bar_' + bar_i,
      group:   'buttons',
      x: 256,
      y: 290 - (25 + 5)*bar_i,
      blit: function() {
        if (this.fight.visible() && the_game.currentBattle.powerLevel >= 10*bar_i) { akiba.magic.standard_blit.call(this); }
      }
    }));
    gbox.addObject(_(fight_screen.enemy_decibel_bars).last());
  });

  // fight_screen.pixxie_health_meter = createTopDown({
  //   id:      'energy_meter_pixxie' + '_vs_' + name,
  //   fight:   fight_screen,
  //   tileset: 'energy_meter_pixxie',
  //   group:   'buttons',
  //   x: 0,
  //   y: 290,
  //   blit: function() {
  //     if (this.fight.visible()) {
  //       var energy_percent = the_game.player.health;
  //       var energy_width_full = 100;
  //       var energy_width = Math.floor(energy_width_full * energy_percent/100);
  //       akiba.magic.standard_blit.call(this);
  // 
  //       gbox.blitRect(gbox.getBufferContext(), {
  //         x: this.x + 15,
  //         y: this.y + 22,
  //         w: energy_width,
  //         h: 8,
  //         // color: 'rgb(125,0,50)'
  //         color: 'rgb(186, 11, 79)'
  //       });
  //     }
  //   }
  // });
  // gbox.addObject(fight_screen.pixxie_health_meter);

  fight_screen.enemy_health_meter = createTopDown({
    id:      'energy_meter_' + name,
    fight:   fight_screen,
    tileset: 'energy_meter_' + name,
    group:   'buttons',
    x: 515,
    y: 290,
    blit: function() {
      if (this.fight.visible()) {
        var energy_width = 73;
        var energy_width_full = 100;
        akiba.magic.standard_blit.call(this);

        gbox.blitRect(gbox.getBufferContext(), {
          x: this.x + energy_width_full - energy_width + 3,
          y: this.y + 22,
          w: energy_width,
          h: 8,
          color: 'rgb(255,255,255)'
        });
      }
    }
  });
  gbox.addObject(fight_screen.enemy_health_meter);

  gbox.addObject(createFrom(fight_screen.foe.aki(), {
    id:    'dopple_' + name,
    x:     605,
    y:     410,
    fight: fight_screen,
    group: 'buttons',
    blit: function() {
      if (this.fight.visible()) {
        akiba.magic.standard_blit.call(this);
      }
    }
  }));

  gbox.addObject(createFrom(fight_screen.foe.aki(), {
    id:      'dopple_pixxie' + '_vs_' + name,
    x:       10,
    y:       410,
    fight:   fight_screen,
    group:   'buttons',
    tileset: 'pixie_battle',
    blit: function() {
      if (this.fight.visible()) { akiba.magic.standard_blit.call(this); }
    }
  }));

  gbox.addObject(createTopDown({
    id:      'status_msg_rock' + '_' + name,
    x:       240,
    y:       288,
    fight:   fight_screen,
    group:   'buttons',
    tileset: 'status_msg_rock',
    blit: function() {
      if (this.fight.visible()) { akiba.magic.standard_blit.call(this); }
    }
  }));

  the_game.fight_screens[name] = fight_screen;

  gbox.addObject(fight_screen.aki());

  return fight_screen;
}

function makeMainScreen(name, options) {
  if (!options) options = {}

  var screen = new GameScreen({
    aki_attributes: {
      id:      options.id      || 'main_screen_' + name,
      group:   options.group   || 'fights',
      tileset: options.tileset || 'main_screen_' + name
    },
    name: name
  });

  the_game['main_screen_' + name] = screen;

  gbox.addObject(screen.aki());
}

createTopDown = function(attributes) {
  if (!attributes) { attributes = {} }

  // return _(akiba.actors.top_down_object).chain().clone().extend(attributes).value();
  return createFrom(akiba.actors.top_down_object, attributes);
}

createFrom = function(source, target) {
  return _(source).chain().clone().extend(target).value();
}