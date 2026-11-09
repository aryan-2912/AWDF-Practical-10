// Dedicated module: one shared EventEmitter instance for the whole app
const EventEmitter = require('events');

class TaskEvents extends EventEmitter {}

module.exports = new TaskEvents();
