var PlatformPerson = Klass.extend({
  init: function(options) {
    if (!options) options = {};

    this.game = the_game;
    this.aki_attributes = options.aki_attributes || {};
    this.id = options.aki_attributes.id;
  },

  getAkiObject: function() {
    var obj = _(this.aki_attributes).extend(akiba.actors.top_down_object);

    akiba.animation.makeAnimationList(obj, 'static_animation');

    this.aki_obj = obj;
    return obj;
  }
});