const express = require('express');
const Task = require('../models/Task');
const taskEvents = require('../events/events');

const router = express.Router();

// GET /tasks
router.get('/', async (req, res, next) => {
  try {
    res.status(200).json(await Task.find());
  } catch (err) { next(err); }
});

// POST /tasks  -> respond first, then emit event
router.post('/', async (req, res, next) => {
  try {
    const task = await Task.create(req.body);

    console.log(`[API] Response sent at ${new Date().toISOString()}`);
    res.status(201).json(task);

    // emit AFTER the response so the ordering is clear
    taskEvents.emit('task-created', task);
  } catch (err) { next(err); }
});

// PUT /tasks/:id
router.put('/:id', async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.status(200).json(task);
  } catch (err) { next(err); }
});

// DELETE /tasks/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.status(200).json({ message: 'Task deleted' });
    taskEvents.emit('task-deleted', task);
  } catch (err) { next(err); }
});

module.exports = router;
