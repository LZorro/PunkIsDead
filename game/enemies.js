var g_foes = {};
var g_fff = true;

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
    hurt:   { speed: 8, frames: [2]    },
    punk:   { speed: 8, frames: [3]    }
  }
  aki.animIndex = 'normal';

  new_foe.startBattle = function() {
    aki.in_battle = true;

    spawnButton('z', { aki_attributes: {} });
    spawnButton('x', { aki_attributes: {} }, 300);
    spawnButton('c', { aki_attributes: {} }, 600);
    spawnButton('v', { aki_attributes: {} }, 1400);

    spawnButton('z', { aki_attributes: {} }, 2000);
    spawnButton('x', { aki_attributes: {} }, 2400);

    gbox.playAudio('bgmix', 'bgmix');
    gbox.playAudio('bggtr', 'bggtr');
  }

  aki.otherAnimationUpdates = function() {
    if (gbox.getObject("player","player_id") && gbox.objectIsVisible(the_game.player) && gbox.objectIsVisible(this) && gbox.collides(the_game.player, this, 1)) {
      if (the_game.player.initialized) {
        if (!this.in_battle) {
          the_game.startBattle();
          new_foe.startBattle();
        }
        this.animIndex = 'hurt';
      }
    } else if (this.converted) {
      this.animIndex = 'punk';
    } else {
      this.animIndex = 'normal';
    }
  }

  g_foes[character_name] = new_foe;

  gbox.addObject(aki);
}