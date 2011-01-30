var g_foes = {};

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
  var new_foe = new Foe({
    aki_attributes: {
      id:      'foe_' + character_name,
      game:    the_game,
      x:       params.x,
      y:       params.y,
      tileset: characters[character_name].tileset
    }
  });

  var aki = new_foe.getAkiObject();
  aki.animList = {
    normal: { speed: 8, frames: [0, 1] },
    hurt:   { speed: 8, frames: [2]    }
    punk:   { speed: 8, frames: [3]    }
  }
  aki.animIndex = 'hurt';

  g_foes[character_name] = new_foe;

  gbox.addObject(aki);
}