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
    var obj = _(this.aki_attributes).extend(akiba.actors.top_down_object);

    this.aki_obj = obj;
    return obj;
  }
});

var Battle = Klass.extend({
  init: function(options) {
    if (!options) options = {};

    this.foe = options.foe;
    this.noteQueue = [];
  },

  start: function() {
    the_game.startBattle(this);
    the_game.changeScreen(this.foe.fight_screen.name);

    this.playNotes();

    gbox.playAudio('bgmix', 'bgmix');
    gbox.playAudio('bggtr', 'bggtr');
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
      var note_letter = note[1];
      if (_(['c', 'v', 'z', 'x']).include(note_letter)) {
        this.noteQueue.push(setTimeout("spawnNote('" + note[1] + "', {})", (note[0] - 11) * 1000));
      }
      // debug.log(note[0], note_letter);
    }, this));
  }
});

MAGIC_TIME = 2300 //1900
var num = 1;
function spawnNote(type, options) {
  the_game.button_c = new Button({ aki_attributes: _({
    id:      options.id,
    tileset: 'button_' + type
  }).extend(options.aki_attributes || {})});

  var a_button_c = the_game.button_c.aki();
  var startTime = new Date().getTime();
  a_button_c.updateAnimation = function() {
    var msec_passed = new Date().getTime() - startTime;
    // console.log(msec_passed);
    this.x = 100 + (MAGIC_TIME - msec_passed)/5;
    if (msec_passed >= MAGIC_TIME) {
      gbox.trashObject(this);
      g_notes = _(g_notes).without(this);
    }
  }
  a_button_c.blit = function() {
    akiba.magic.standard_blit.call(a_button_c);
  }

  if (type === 'z') {
    a_button_c.y = 335;
  } else if (type === 'x') {
    a_button_c.y = 365;
  } else if (type === 'c') {
    a_button_c.y = 395;
  } else if (type === 'v') {
    a_button_c.y = 425;
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
    name: name
  });

  fight_screen.enemy_decibel_meter = createTopDown({
    id:      'fight_screen_decibel_meter_' + name,
    fight:   fight_screen,
    tileset: 'decibel_meter_' + name,
    group:   'buttons',
    x: 205,
    y: 0,
    blit: function() {
      if (this.fight.visible()) { akiba.magic.standard_blit.call(this); }
    }
  });
  gbox.addObject(fight_screen.enemy_decibel_meter);

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

  return _(akiba.actors.top_down_object).chain().clone().extend(attributes).value();
}