var AppDispatcher = require('../dispatchers/appDispatcher');
var appConstants = require('../constants/appConstants');
var icecommActions = require('./icecommActions');

var socket = io();

socket.on('staffRoom', function(data) {
  console.log('Received socket response with roomname: ', data);
  AppDispatcher.dispatch({
    type: appConstants.JOIN_ROOM,
    data: data
  });
  icecommActions.setIcecommRoom(data);
});

var socketActions = {
  staffReady: function() {
    socket.emit('staffReady');
  }
};

module.exports = socketActions;
