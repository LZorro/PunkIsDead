//Load all the image resources, this means plugins too!
function getImageResources(){
  //Load default resources
  var imageResources =
    [
      ['font',                 'images/CasualEncounter.png'],
      ['logo',                 'images/logo.png'],
      ['player_sprite',        'images/walk.png'],
      ['map_spritesheet',      'images/map_pieces.png'],
      ['enemy_sprite',         'images/enemy_sprite.png'],
      ['enemy_sprite1',        timestampedURL('images/enemy_sprite1.png')],
      ['enemy_sprite2',        'images/enemy_sprite2.png'],
      ['enemy_sprite3',        'images/enemy_sprite3.png'],
      ['enemy_dot',            'images/enemy_dot.png'],
      ['block_sprite',         'images/block_sprite.png'],
      ['city_background',      'images/city_background.png'],
      ['background_tilesheet', 'images/bg1.png']
    ];
  if($config.use_plugins){
//    imageResources = [];
    for(var plugin in pluginHelper.loadedPlugins) {
      if (pluginHelper.loadedPlugins[plugin].sprites) {
        jQuery.merge(imageResources,pluginHelper.loadedPlugins[plugin].sprites);
      }
    }
  }
  return imageResources;
}

//Load all the tile resources, this means plugins too!
function getTileResources(){
  //Load default resources
  var tileResources = [
    {
      id:      'map_pieces',
      image:   'map_spritesheet',
      tileh:   32,
      tilew:   32,
      tilerow: 9,
      gapx:    0,
      gapy:    0
    },
    {
      id:      'player_tiles',
      image:   'player_sprite',
      tileh:   64,
      tilew:   32,
      tilerow: 10,
      gapx:    0,
      gapy:    0
    },
    {
      id:      'block_tiles',
      image:   'block_sprite',
      tileh:   32,
      tilew:   32,
      tilerow: 3,
      gapx:    0,
      gapy:    0
    },
    {
      id:      'background_tiles',
      image:   'background_tilesheet',
      tileh:   32,
      tilew:   32,
      tilerow: 3,
      gapx:    0,
      gapy:    0
    },
    {
      id:      'enemy_1_set',
      image:   'enemy_sprite1',
      tileh:   64,
      tilew:   32,
      tilerow: 5,
      gapx:    0,
      gapy:    0
    },
    {
      id:      'enemy_sarah',
      image:   'enemy_sprite1',
      tileh:   64,
      tilew:   32,
      tilerow: 5,
      gapx:    0,
      gapy:    0
    },
    {
      id:      'enemy_chris',
      image:   'enemy_sprite2',
      tileh:   64,
      tilew:   32,
      tilerow: 5,
      gapx:    0,
      gapy:    0
    },
    {
      id:      'enemy_joe',
      image:   'enemy_sprite3',
      tileh:   64,
      tilew:   32,
      tilerow: 5,
      gapx:    0,
      gapy:    0
    },
    {
      id:      'enemy_dot',
      image:   'enemy_dot',
      tileh:   32,
      tilew:   32,
      tilerow: 2,
      gapx:    0,
      gapy:    0
    },
    {
      id:      'city_background',
      image:   'city_background',
      tileh:   415,
      tilew:   2400,
      tilerow: 2,
      gapx:    0,
      gapy:    0
    },
    {
      id:      'explosion_tiles',
      image:   'explosion_sprite',
      tileh:   96,
      tilew:   96,
      tilerow: 14,
      gapx:    0,
      gapy:    0
    }
  ];
  if($config.use_plugins){
//    tileResources = [];
    for(var plugin in pluginHelper.loadedPlugins){
      if(pluginHelper.loadedPlugins[plugin].tiles){
        jQuery.merge(tileResources,pluginHelper.loadedPlugins[plugin].tiles);
      }
    }
  }
  return tileResources;
}


//Load all the audio resources, this means plugins too!
function getAudioResources(){
  //Load default resources
  var audioResources = [
    ['jump', ['sounds/jump.mp3', 'sounds/jump.ogg'], { channel: 'jump' }],
    ['star', ['sounds/coin.mp3', 'sounds/coin.ogg'], { channel: 'hit' }],
	['bgmix', ['sounds/LVL1 mix.ogg'], { channel: 'bgmix', loop: false }],
	['bggtr', ['sounds/LVL1 GTRs.ogg'], { channel: 'bggtr', loop: false }]
    ];
  if($config.use_plugins){
//    audioResources = [];
    for(var plugin in pluginHelper.loadedPlugins){
      if(pluginHelper.loadedPlugins[plugin].audio){
        audioResources.push(pluginHelper.loadedPlugins[plugin].audio);
      }
    }
  }
  return audioResources;
}
//Load all the font resources, this means plugins too!
function getFontResources(){
  //Load default resources
  var fontResources = [
    { id: 'small', image: 'font', firstletter: ' ', tileh: 20, tilew: 14, tilerow: 255, gapx: 0, gapy: 0 }
  ];
  if($config.use_plugins){
//    fontResources = [];
    for(var plugin in pluginHelper.loadedPlugins){
      if(pluginHelper.loadedPlugins[plugin].font){
        fontResources.push(pluginHelper.loadedPlugins[plugin].font);
      }
    }
  }
  return fontResources;
}
