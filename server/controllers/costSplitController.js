import ExpenseSplit from '../models/ExpenseSplit.js';
import calculateSettlements from '../utils/costSplitCalculator.js';

// POST /api/split/groups
export const createGroup = async (req, res, next) => {
  try {
    const { groupName, members, tripId } = req.body;
    const group = await ExpenseSplit.create({
      groupName,
      members,
      tripId,
      createdBy: req.userId,
    });
    res.status(201).json({ message: 'Group created', group });
  } catch (error) {
    next(error);
  }
};

// POST /api/split/expenses
export const addExpense = async (req, res, next) => {
  try {
    const { groupId, description, amount, paidBy, splitAmong } = req.body;
    const group = await ExpenseSplit.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    group.expenses.push({ description, amount, paidBy, splitAmong });
    await group.save();

    res.status(201).json({ message: 'Expense added', group });
  } catch (error) {
    next(error);
  }
};

// GET /api/split/groups/:id
export const getGroup = async (req, res, next) => {
  try {
    const group = await ExpenseSplit.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    const settlements = calculateSettlements(group.members, group.expenses);
    res.json({ group, settlements });
  } catch (error) {
    next(error);
  }
};

// GET /api/split/groups/:id/settle
export const getSettlements = async (req, res, next) => {
  try {
    const group = await ExpenseSplit.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    const settlements = calculateSettlements(group.members, group.expenses);
    res.json(settlements);
  } catch (error) {
    next(error);
  }
};
