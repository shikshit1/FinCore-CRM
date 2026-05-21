import Task from '../models/Task.js';
import ActivityLog from '../models/ActivityLog.js';

export const getAllTasks = async (req, res) => {
  try {
    const { status, priority, assignedTo, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignedTo) query.assignedTo = assignedTo;

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email')
      .populate('relatedCustomer', 'firstName lastName')
      .populate('relatedLoan', 'applicationNumber')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ dueDate: 1 });

    const total = await Task.countDocuments(query);

    res.json({
      tasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo')
      .populate('assignedBy')
      .populate('relatedCustomer')
      .populate('relatedLoan');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      assignedBy: req.user.userId,
    });

    await task.save();

    await ActivityLog.create({
      user: req.user.userId,
      action: 'Created task',
      entityType: 'Task',
      entityId: task._id,
      newValues: task.toObject(),
    });

    res.status(201).json({
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({
      message: 'Task updated successfully',
      task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const completeTask = async (req, res) => {
  try {
    const { completionNotes } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        status: 'completed',
        completionDate: new Date(),
        completionNotes,
        updatedAt: new Date(),
      },
      { new: true }
    );

    await ActivityLog.create({
      user: req.user.userId,
      action: 'Completed task',
      entityType: 'Task',
      entityId: task._id,
    });

    res.json({
      message: 'Task completed successfully',
      task,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await ActivityLog.create({
      user: req.user.userId,
      action: 'Deleted task',
      entityType: 'Task',
      entityId: task._id,
    });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
