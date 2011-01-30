var ALESTest = Klass.extend({
  init: function() {
    debug.log('Starting ALES Test game...');

    this.frameCount = 0;

    // This initializes Akihabara with the default settings.
    // The title (which appears in the browser title bar) is the text we're passing to the function.

    level = levelParam;

    help.akihabaraInit({ width: 640, height: 480, zoom: 1, title: (getURLParam('name') ? getURLParam('name') : 'Akihabara Level Editor & Sharer (ALES)') });

    gbox.addBundle({ file: 'bundle.js?' + timestamp() });

  //var isMusicOn = true;
    $aki.controls.watchKeys({
      B: function() {
        console.log('B pressed');
      },
      C: function() {
        debug.log('C pressed');
        battle_system.input('c');
      },
      SPACE: function() {
        if (g_screen === 'intro') {
          g_screen = 'tutorial';
        } else if (g_screen === 'tutorial') {
          g_screen = null;
        }
      },
      W: function() {
        console.log("W");
        the_game.win();
      },
      L: function() {
        the_game.lose();
      }
    });

    // The 'main' function is registered as a callback: this just says that when we're done with loadAll we should call 'main'
    gbox.setCallback(main);

    // When everything is ready, the 'loadAll' downloads all the needed resources.
    gbox.loadAll();

    gbox._passKeysThrough = 1;
  },

  defaultPlugins: function() {
    return 'plugins/defaultPlugins.json';
  },

  startGame: function() {
    the_game.player = addPlayer();

    addMap();

	battle_system = addBattleManager();
	
    makeFoe('sarah', { x: 200, y: 256 });
    makeFoe('chris', { x: 300, y: 256 });
    makeFoe('joe',   { x: 400, y: 256 });

    // Fight screen
    the_game.fight_screen = new Screen({ aki_attributes: {
      id:      'sarah_fight',
    }});
    var fight_aki = the_game.fight_screen.getAkiObject();
    gbox.addObject(fight_aki);
    fight_aki.blit = function() {
      if (g_foes.sarah.aki_obj.in_battle) {
        akiba.magic.standard_blit.call(fight_aki);
      }
    }

    // Fight screen
    the_game.fight_screen_3 = new Screen({ aki_attributes: {
      id:      'joe_fight',
      tileset: 'fight_background_2'
    }});
    var fight_aki_3 = the_game.fight_screen_3.getAkiObject();
    gbox.addObject(fight_aki_3);
    fight_aki_3.blit = function() {
      if (g_foes.joe.aki_obj.in_battle) {
        akiba.magic.standard_blit.call(fight_aki_3);
      }
    }

    // Fight screen
    the_game.fight_screen_2 = new Screen({ aki_attributes: {
      id:      'chris_fight',
      tileset: 'fight_background_1'
    }});
    var fight_aki_2 = the_game.fight_screen_2.getAkiObject();
    gbox.addObject(fight_aki_2);
    fight_aki_2.blit = function() {
      if (g_foes.chris.aki_obj.in_battle) {
        akiba.magic.standard_blit.call(fight_aki_2);
      }
    }

    // Intro screen
    the_game.intro_screen = new Screen({ aki_attributes: {
      id:      'intro_screen',
      group:   'fights',
      tileset: 'intro_screen'
    }});
    var aki = the_game.intro_screen.getAkiObject();

    aki.blit = function() {
      if (g_screen === 'intro') {
        akiba.magic.standard_blit.call(aki);
      }
    }
    gbox.addObject(aki);

    // Tutorials screen
    the_game.tutorial_screen = new Screen({ aki_attributes: {
      id:      'tutorial_screen',
      group:   'fights',
      tileset: 'tutorial_screen'
    }});
    var aki_2 = the_game.tutorial_screen.getAkiObject();
    aki_2.blit = function() {
      if (g_screen === 'tutorial') {
        akiba.magic.standard_blit.call(aki_2);
      }
    }
    gbox.addObject(aki_2);

    // Win screen
    the_game.win_screen = new Screen({ aki_attributes: {
      id:      'win_screen',
      group:   'fights',
      tileset: 'win_screen'
    }});
    var aki_3 = the_game.win_screen.getAkiObject();
    aki_3.blit = function() {
      if (g_screen === 'win') {
        akiba.magic.standard_blit.call(aki_3);
      }
    }
    gbox.addObject(aki_3);

    // Lose screen
    the_game.lose_screen = new Screen({ aki_attributes: {
      id:      'lose_screen',
      group:   'fights',
      tileset: 'lose_screen'
    }});
    var aki_4 = the_game.lose_screen.getAkiObject();
    aki_4.blit = function() {
      if (g_screen === 'lose') {
        akiba.magic.standard_blit.call(aki_4);
      }
    }
    gbox.addObject(aki_4);
  },

  startBattle: function() {
    console.log('Battle started!');
    this.player.startBattle();
  },

  win: function() {
    g_screen = 'win';
  },
  
  lose: function() {
    g_screen = 'lose';
  }
});
