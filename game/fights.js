var Screen = Klass.extend({
  init: function(options) {
    if (!options) options = {};

    this.game = the_game;
    this.aki_attributes = _.extend({
      group:   'fights'
    }, options.aki_attributes || {});

    this.id = this.aki_attributes.id;
  },

  getAkiObject: function() {
    this.aki_obj = _(akiba.actors.top_down_object).chain().clone().extend(this.aki_attributes).value();

    return this.aki_obj;
  }
});

var Button = Klass.extend({
  init: function(options) {
    if (!options) options = {};

    this.game = the_game;
    this.aki_attributes = _.extend({
      group:   'buttons'
    }, options.aki_attributes || {});

    this.id = this.aki_attributes.id;
  },

  getAkiObject: function() {
    var obj = _(this.aki_attributes).extend(akiba.actors.top_down_object);

    this.aki_obj = obj;
    return obj;
  }
});

MAGIC_TIME = 1900
var num = 1;
function spawnButton(type, options, delay) {
  if (!delay) { delay = 0; }

  setTimeout(function() {
    the_game.button_c = new Button({ aki_attributes: _({
      id:      options.id,
      tileset: 'button_' + type
    }).extend(options.aki_attributes || {})});

    var a_button_c = the_game.button_c.getAkiObject();
    var startTime = new Date().getTime();
    a_button_c.updateAnimation = function() {
      var msec_passed = new Date().getTime() - startTime;
      // console.log(msec_passed);
      this.x = 100 + (MAGIC_TIME - msec_passed)/5;
      if (msec_passed >= MAGIC_TIME) {
        gbox.trashObject(this);
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

    gbox.addObject(a_button_c);
  }, delay);
}

function makeFightScreen(name, options) {
  if (!options) options = {}

  var fight_screen = new Screen({
    aki_attributes: {
      id:      options.id      || 'fight_' + name,
      tileset: options.tileset || 'fight_background_' + name
    }
  });

  the_game['fight_screen_' + name] = fight_screen;

  var aki = fight_screen.getAkiObject();
  aki.blit = function() {
    if (g_foes[name].aki_obj.in_battle) {
      akiba.magic.standard_blit.call(aki);
    }
  }
  gbox.addObject(aki);
}

function makeMainScreen(name, options) {
  if (!options) options = {}

  var screen = new Screen({ aki_attributes: {
    id:      options.id      || 'main_screen_' + name,
    group:   options.group   || 'fights',
    tileset: options.tileset || 'main_screen_' + name
  }});

  the_game['main_screen_' + name] = screen;

  var aki = screen.getAkiObject();
  aki.blit = function() {
    if (g_screen === name) {
      akiba.magic.standard_blit.call(aki);
    }
  }
  gbox.addObject(aki);
}