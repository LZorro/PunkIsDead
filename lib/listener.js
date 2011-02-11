var Messenger = {
  name: 'The Messenger'
}
$m = $(Messenger);
msg = {
  text: {
    killed: 'Killed:'//'Joining the dead:'
  }
}

var MessageListener = Klass.extend({
  init: function() {
    this.silent = false;
  },

  log: function() {
    if (!this.silent) {
      debug.log.apply(debug, arguments);
    }
  }
});

var GlobalListener = MessageListener.extend({
  init: function() {
    this._super();
    var self = this;

    $(this).bind('death', function(event, data) {
      self.log(data.subject.id, 'killed', data.object.id);
    });

    $(this).bind('spawn', function(event, data) {
      self.log(data.subject.id, 'spawned', data.object.id);
    });
  },

  inform: function(subject, event_name, object, data) {
    $(this).trigger(event_name, {
      type:    event_name,
      subject: subject,
      object:  object,
      data:    data
    });
  }
});

g_debug_all_events = false;
$listener = new GlobalListener();
$l = $($listener);
$m = function(event_name, data) {
  if (data === undefined) { data = {} }

  if (g_debug_all_events) {
    console.log('Event', event_name, data);
  }
  $l.trigger(event_name, data);
}

function instrumentFunction(context, functionName, callback) {
  context = context || window;
  context['_old' + functionName] = context[functionName];
  context[functionName] = function() { 
      callback.call(this, printStackTrace());
      return context['_old' + functionName].apply(this, arguments);
  };
  context[functionName]._instrumented = true;
}

function Stringify(jsonData) {
    var strJsonData = '{';
    var itemCount = 0;
    for (var item in jsonData) {
        if (itemCount > 0) {
            strJsonData += ', ';
        }
        strJsonData += '"' + item + '":"' + jsonData[item] + '"';
        itemCount++;
    }
    strJsonData += '}';
    return strJsonData;
}