var g_foes = {};

var Foe = PlatformPerson.extend({
  init: function(options) {
    options.aki_attributes = _.extend({
      group:   'enemies',
      hitByPlayer: function() {
        // $listener.inform(the_game.player_one, 'started battle', this);

        // Start Battle...
        // TODO: write this code
      }
    }, options.aki_attributes || {});

    this._super(options);

    this.aki_obj.animList = {
      normal: { speed: 8, frames: [0, 1] },
      hurt:   { speed: 8, frames: [2]    },
      punk:   { speed: 8, frames: [3]    }
    }
    this.aki_obj.animIndex = 'normal';

    var that = this;
    this.aki_obj.otherAnimationUpdates = function() {
      if (the_game.player && gbox.objectIsVisible(the_game.player) && gbox.objectIsVisible(this) && gbox.collides(the_game.player, this, 1)) {
        if (the_game.player.initialized) {
          if (!this.in_battle) {
            that.startBattle();
          }
          this.animIndex = 'hurt';
        }
      } else if (this.converted) {
        this.animIndex = 'punk';
      } else {
        this.animIndex = 'normal';
      }
    }

    this.battle = new Battle({ foe: this });
  },

  startBattle: function() {
    this.aki_obj.in_battle = true;
    this.battle.start();
  }
});

characters = {
  teeny: {
    tileset: 'enemy_teeny'
  },

  poser: {
    tileset: 'enemy_poser'
  },

  dmann: {
    tileset: 'enemy_dmann'
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

  gbox.addObject(new_foe.aki());

  the_game.foes[character_name] = new_foe;

  new_foe.fight_screen = makeFightScreen(character_name);
}