function getImageResources(){
  var imageResources =
    [
      ['font',                 'images/CasualEncounter.png'],
      ['logo',                 'images/logo.png'],
      ['player_sprite',        'images/walk.png'],
      ['map_spritesheet',      'images/map_pieces.png'],
      ['enemy_sprite',         'images/enemy_sprite.png'],
      ['enemy_sprite1',        'images/enemy_sprite1.png'],
      ['enemy_sprite2',        'images/enemy_sprite2.png'],
      ['enemy_sprite3',        'images/enemy_sprite3.png'],
      ['city_background',      'images/city_background.png'],
      ['fight_background_1',    'images/battlescreens/poserbs.png'],
      ['fight_background_2',    'images/battlescreens/dmannbs.png'],
      ['fight_background_3',    'images/battlescreens/teenybs.png'],
      ['screen_splash',        'images/titlescreen.png'],
      ['screen_tutorial',      'images/tutorial.png'],
      ['screen_win',           'images/win.png'],
      ['screen_lose',          'images/lose.png']
    ];

  _(['pixxie', 'teeny', 'dmann']).each(function(name) {
    imageResources.push(['decibel_meter_' + name, 'images/decibel_meters/' + name + 'decibelmeter.png']);
  });

  _(['c', 'v', 'x', 'z']).each(function(name) {
    imageResources.push(['button_' + name, 'images/buttons/button_' + name + '.png']);
  });

  return imageResources;
}

function getTileResources() {

  var tileResources = [
    {
      id:      'map_pieces',
      image:   'map_spritesheet',
      tileh:   32,
      tilew:   32,
      tilerow: 9
    },
    {
      id:      'player_tiles',
      image:   'player_sprite',
      tileh:   64,
      tilew:   32,
      tilerow: 10
    },
    {
      id:      'enemy_1_set',
      image:   'enemy_sprite1',
      tileh:   64,
      tilew:   32,
      tilerow: 5
    },
    {
      id:      'enemy_sarah',
      image:   'enemy_sprite1',
      tileh:   64,
      tilew:   32,
      tilerow: 5
    },
    {
      id:      'enemy_chris',
      image:   'enemy_sprite2',
      tileh:   64,
      tilew:   32,
      tilerow: 5
    },
    {
      id:      'enemy_joe',
      image:   'enemy_sprite3',
      tileh:   64,
      tilew:   32,
      tilerow: 5
    },
    {
      id:      'city_background',
      image:   'city_background',
      tileh:   415,
      tilew:   2400
    },
    {
      id:      'explosion_tiles',
      image:   'explosion_sprite',
      tileh:   96,
      tilew:   96,
      tilerow: 14
    },
    {
      id:      'fight_background_chris',
      image:   'fight_background_1',
      tilew:   640,
      tileh:   480
    },
    {
      id:      'fight_background_joe',
      image:   'fight_background_2',
      tilew:   640,
      tileh:   480
    },
    {
      id:      'fight_background_sarah',
      image:   'fight_background_3',
      tilew:   640,
      tileh:   480
    },
    {
      id:      'main_screen_intro',
      image:   'screen_splash',
      tilew:   640,
      tileh:   480
    },
    {
      id:      'main_screen_tutorial',
      image:   'screen_tutorial',
      tilew:   640,
      tileh:   480
    },
    {
      id:      'main_screen_win',
      image:   'screen_win',
      tilew:   640,
      tileh:   480
    },
    {
      id:      'main_screen_lose',
      image:   'screen_lose',
      tilew:   640,
      tileh:   480
    },
    {
      id:      'button_c',
      image:   'button_c',
      tilew:   32,
      tileh:   32
    },
    {
      id:      'button_v',
      image:   'button_v',
      tilew:   32,
      tileh:   32
    },
    {
      id:      'button_x',
      image:   'button_x',
      tilew:   32,
      tileh:   32
    },
    {
      id:      'button_z',
      image:   'button_z',
      tilew:   32,
      tileh:   32
    }
  ];

  _(['pixxie', 'teeny', 'dmann']).each(function(name) {
    tileResources.push({
      id:    'decibel_meter_' + name,
      image: 'decibel_meter_' + name,
      tilew: 289,
      tileh: 111
    });
  });

  return tileResources;
}

function getAudioResources(){
  var audioResources = [
    ['jump', ['sounds/jump.mp3', 'sounds/jump.ogg'], { channel: 'jump' }],
    ['star', ['sounds/coin.mp3', 'sounds/coin.ogg'], { channel: 'hit' }],
	  ['bgmix', ['sounds/LVL1 mix.ogg'], { channel: 'bgmix', loop: false }],
	  ['bggtr', ['sounds/LVL1 GTRs.ogg'], { channel: 'bggtr', loop: false }]
  ];

  return audioResources;
}

function getFontResources(){
  var fontResources = [
    { id: 'small', image: 'font', firstletter: ' ', tileh: 20, tilew: 14, tilerow: 255, gapx: 0, gapy: 0 }
  ];

  return fontResources;
}
