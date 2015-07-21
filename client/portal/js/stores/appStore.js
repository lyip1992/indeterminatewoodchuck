var AppDispatcher = require('../dispatchers/appDispatcher');
var appConstants = require('../constants/appConstants');
var objectAssign = require('react/lib/Object.assign');
var EventEmitter = require('events').EventEmitter;

var CHANGE = 'CHANGE';

var _state = {
  room: '',
  orgName: '',
  employeeId: '',
  employeeFirstName: '',
  employeeLastName: '',
  employeeTitle: '',
  employeeEmail: ''
};

var setRoom = function(room) {
  _state.room = room;
};

var setEmployeeData = function(data) {
  for (var key in data) {
    _state[key] = data[key];
  }
};

var appStore = objectAssign({}, EventEmitter.prototype, {
  addChangeListener: function(cb){
    this.on(CHANGE, cb);
  },
  removeChangeListener: function(cb){
    this.removeListener(CHANGE, cb);
  },
  getState: function() {
    return _state;
  }
});

appStore.dispatchToken = AppDispatcher.register(function(payload) {
  if (payload.actionType === appConstants.JOIN_ROOM) {
    setRoom(payload.data);
    appStore.emit(CHANGE);
  } else if (payload.actionType === appConstants.SET_EMPLOYEE_DATA) {
    setEmployeeData(payload.employeeData);
    appStore.emit(CHANGE);
  }

  return true;
});

module.exports = appStore;
