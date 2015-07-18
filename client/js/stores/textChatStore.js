var AppDispatcher = require('../dispatchers/appDispatcher');
var appConstants = require('../constants/appConstants');
var objectAssign = require('react/lib/Object.assign');
var EventEmitter = require('events').EventEmitter;

var CHANGE = 'CHANGE';

var _messages = [];

var addMessage = function(message) {
  _messages.push(message);
};

var textChatStore = objectAssign({}, EventEmitter.prototype, {
  addChangeListener: function(cb){
    this.on(CHANGE, cb);
  },
  removeChangeListener: function(cb){
    this.removeListener(CHANGE, cb);
  },
  getMessages: function() {
    return _messages;
  }
});

textChatStore.dispatchToken = AppDispatcher.register(function(payload) {
  if (payload.actionType === appConstants.SEND_TEXT_MESSAGE) {
    _messages.push(payload.message);
    textChatStore.emit(CHANGE);
  }

  return true;
});

module.exports = textChatStore;