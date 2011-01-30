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
    options.aki_attributes = _.extend({
      group:   'enemies',
      tileset: 'enemy_1_set',
      hitByPlayer: function() {
        // $listener.inform(the_game.player_one, 'started battle', this);

        // Start Battle...
        // TODO: write this code
      }
    }, options.aki_attributes || {});

    this._super(options);
  }
});

characters = {
  sarah: {
    tileset: 'enemy_sarah'
  },
  chris: {
    tileset: 'enemy_chris'
  },
  joe: {
    tileset: 'enemy_joe'
  }
}

function makeFoe(character_name, params) {
  foe = new Foe({
    aki_attributes: {
      id:      'foe_' + character_name,
      game:    the_game,
      x:       params.x,
      y:       params.y,
      tileset: characters[character_name].tileset
    }
  });

  gbox.addObject(foe.getAkiObject());
}