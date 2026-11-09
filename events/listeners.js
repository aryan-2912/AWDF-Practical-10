// All event listeners are registered here (required once in server.js)
const taskEvents = require('./events');

// Delay (ms) to simulate a slow notification handler
const HANDLER_DELAY = Number(process.env.HANDLER_DELAY_MS) || 2000;

taskEvents.on('task-created', (task) => {
  console.log(`[Listener] task-created received at ${new Date().toISOString()}`);

  // setTimeout makes the async behaviour visible in the console
  setTimeout(() => {
    console.log(
      `[Notification] Task "${task.title}" created | assigned to: ${task.assignedUser} | ` +
      `completed at ${new Date().toISOString()}`
    );
  }, HANDLER_DELAY);
});

// Supplementary: task-deleted event
taskEvents.on('task-deleted', (task) => {
  console.log(`[Notification] Task "${task.title}" deleted at ${new Date().toISOString()}`);
});

// Supplementary: error listener so a failing handler never crashes the server
taskEvents.on('error', (err) => {
  console.error(`[Event Error] ${err.message}`);
});
