var Screen = Klass.extend({
  init: function(options) {
    if (!options) options = {};

    this.game = the_game;
    this.aki_attributes = _.extend({
      group:   'fights',
      tileset: 'fight_background_1'
    }, options.aki_attributes || {});

    this.id = this.aki_attributes.id;
  },

  getAkiObject: function() {
    var obj = _(_(akiba.actors.top_down_object).clone()).extend(this.aki_attributes);

    this.aki_obj = obj;
    return obj;
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
      console.log(msec_passed);
      this.x = 100 + (MAGIC_TIME - msec_passed)/5;
      if (msec_passed >= MAGIC_TIME) {
        gbox.trashGroup('buttons');
      }
    }
    a_button_c.blit = function() {
      akiba.magic.standard_blit.call(a_button_c);
    }
    gbox.addObject(a_button_c);
  }, delay);
}