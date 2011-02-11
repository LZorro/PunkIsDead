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

g_num_notes = 1;
T_NOTE_EXPIRATION_MS = 3300

g_deb_pwr = 0;
var Note = Button.extend({
  init: function(options) {
    if (!options) options = {};
    this._super(options);

    var note = this;

    _.extend(this.aki_obj, {
      tileset: 'button_' + this.type,
      missed:  false,
      updateAnimation: function() {
        var msec_passed = new Date().getTime() - note.startTime;
        // console.log(msec_passed);
        this.x = 30 + (T_NOTE_EXPIRATION_MS - msec_passed)/5;
        if (msec_passed >= T_NOTE_EXPIRATION_MS) {
          gbox.trashObject(this);
          g_notes = _(g_notes).without(this);
        } else if (msec_passed >= (T_NOTE_EXPIRATION_MS - 300)) {
          if (!this.missed) {
            this.missed = true;
            this.tileset = 'button_hit';
            $m('note_success', {});
          }
        }
      }
    });

    var note_top = 355;
    var inc = 28;
    if (this.type === 'z') {
      this.aki_obj.y = note_top;
    } else if (this.type === 'x') {
      this.aki_obj.y = note_top + inc;
    } else if (this.type === 'c') {
      this.aki_obj.y = note_top + inc*2;
    } else if (this.type === 'v') {
      this.aki_obj.y = note_top + inc*3;
    }
    this.aki_obj.x = 100;
    this.aki_obj.id = 'button_' + this.type + g_num_notes++;

    g_notes.push(this.aki_obj);
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

    $l.bind('note_success', $.proxy(function(event, data) {
      this.powerLevel += Math.ceil(100/8);
      if (this.powerLevel >= 100) {
        this.powerLevel = 0;
        $m('attack_foe', { foe: this.foe, damage: 9 });
      }
    }, this));

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

  playNotes: function() {
    _(battle_manager.song_data).each(_.bind(function(note) {
      var note_letter = note[1], note_seconds_into_song = note[0];
      if (_(['c', 'v', 'z', 'x']).include(note_letter)) {
        this.noteQueue.push(setTimeout("spawnNote('" + note_letter + "', {})", note_seconds_into_song * 1000));
      }
    }, this));
  }
});

function spawnNote(type, options) {
  the_game.button_c = new Note({
    type: type,
    startTime: new Date().getTime()
  });

  gbox.addObject(the_game.button_c.aki());
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
      }
    }
  });
  gbox.addObject(fight_screen.enemy_decibel_meter);

  fight_screen.enemy_decibel_bars = [];
  var num_bars = 8;
  _(_.range(1, num_bars)).each(function(bar_i) {
    fight_screen.enemy_decibel_bars.push(createTopDown({
      id:      'fight_screen_decibel_meter_' + name + '_num_' + bar_i,
      fight:   fight_screen,
      tileset: 'decibel_meter_bar_' + bar_i,
      group:   'buttons',
      x: 256,
      y: 290 - (25 + 5)*bar_i,
      blit: function() {
        if (this.fight.visible() && the_game.currentBattle.powerLevel >= Math.ceil(100/num_bars)*bar_i) { akiba.magic.standard_blit.call(this); }
      }
    }));
    gbox.addObject(_(fight_screen.enemy_decibel_bars).last());
  });

  fight_screen.enemy_health_meter = createTopDown({
    id:      'energy_meter_' + name,
    fight:   fight_screen,
    tileset: 'energy_meter_' + name,
    group:   'buttons',
    x: 515,
    y: 290,
    blit: function() {
      if (this.fight.visible()) {
        var energy_width_full = 90;
        var energy_width = energy_width_full*(this.fight.foe.energy_level/100);

        akiba.magic.standard_blit.call(this);

        gbox.blitRect(gbox.getBufferContext(), {
          x: this.x + energy_width_full - energy_width + 16,
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