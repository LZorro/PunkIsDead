var PlatformPerson = Klass.extend({
  init: function(options) {
    if (!options) options = {};

    this.game = the_game;
    _(this).extend(options);

    this.aki_attributes = options.aki_attributes || {};

    this.aki_obj = createTopDown(this.aki_attributes);
    akiba.animation.makeAnimationList(this.aki_obj, 'static_animation');

    this.id = options.aki_attributes.id;
    this.name = this.name || this.id;
  },

  aki: function() {
    return this.aki_obj;
  }
});