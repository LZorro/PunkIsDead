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
        console.log('C pressed');
      },
      Z: function() {
        console.log('hi');
        if (g_screen === 'intro') {
          g_screen = null;
        }
      }
      //,
 /*    D: function() {
    console.log('D was: ' + isMusicOn);
    isMusicOn = !isMusicOn;
    if (isMusicOn)
      //gbox.playAudio('bgmix', 'bgmix');
      gbox.setAudioUnmute('bggtr');
    else
      //gbox.stopAudio('bgmix');
      gbox.setAudioMute('bggtr');
    } */
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

    makeFoe('sarah', { x: 200, y: 256 });
    makeFoe('chris', { x: 300, y: 256 });
    makeFoe('joe',   { x: 400, y: 256 });

    // Fight screen
    the_game.fight_screen = new Screen();
    gbox.addObject(the_game.fight_screen.getAkiObject());

    // Intro screen
    the_game.intro_screen = new Screen({ aki_attributes: {
      group:   'fights',
      tileset: 'intro_screen'
    }});
    var aki = the_game.intro_screen.getAkiObject();
    aki.blit = function() {
      if (g_screen === 'intro') {
        akiba.magic.standard_blit.apply(aki);
      }
    }
    gbox.addObject(aki);
  },

  startBattle: function() {
    console.log('Battle started!');
    this.player.startBattle();
  }
});
