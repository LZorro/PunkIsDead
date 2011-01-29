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
    // akiba.physics.setPhysics(obj);

    this.obj = obj;
    return obj;
  }
});

var Foe = PlatformPerson.extend({
  init: function(options) {
    options.aki_attributes = _.extend(options.aki_attributes || {}, {
      group:   'enemies',
      tileset: 'enemy_1_set',
      hitByPlayer: function() {
        // $listener.inform(the_game.player_one, 'started battle', this);

        // Start Battle...
        // TODO: write this code
      }
    });

    this._super(options);
  }
});