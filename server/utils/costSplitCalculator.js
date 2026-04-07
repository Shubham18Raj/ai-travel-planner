/**
 * Splitwise-style expense settlement calculator
 * Uses the "minimum transactions" greedy algorithm
 */

function calculateSettlements(members, expenses) {
  // Calculate net balance for each member
  const balances = {};
  members.forEach(m => { balances[m.name] = 0; });

  expenses.forEach(expense => {
    const { paidBy, amount, splitAmong } = expense;
    const splitCount = splitAmong.length || members.length;
    const perPersonShare = amount / splitCount;

    // Person who paid is owed money
    balances[paidBy] = (balances[paidBy] || 0) + amount;

    // Each person in the split owes their share
    const splitList = splitAmong.length > 0 ? splitAmong : members.map(m => m.name);
    splitList.forEach(person => {
      balances[person] = (balances[person] || 0) - perPersonShare;
    });
  });

  // Separate into debtors (negative balance) and creditors (positive balance)
  const debtors = [];
  const creditors = [];

  Object.entries(balances).forEach(([name, balance]) => {
    const rounded = Math.round(balance * 100) / 100;
    if (rounded < -0.01) {
      debtors.push({ name, amount: Math.abs(rounded) });
    } else if (rounded > 0.01) {
      creditors.push({ name, amount: rounded });
    }
  });

  // Sort for greedy matching
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  // Generate minimum transactions
  const settlements = [];
  let i = 0, j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const settleAmount = Math.min(debtor.amount, creditor.amount);

    if (settleAmount > 0.01) {
      settlements.push({
        from: debtor.name,
        to: creditor.name,
        amount: Math.round(settleAmount * 100) / 100,
      });
    }

    debtor.amount -= settleAmount;
    creditor.amount -= settleAmount;

    if (debtor.amount < 0.01) i++;
    if (creditor.amount < 0.01) j++;
  }

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const perPersonAvg = Math.round((totalExpenses / members.length) * 100) / 100;

  return {
    settlements,
    balances: Object.entries(balances).map(([name, balance]) => ({
      name,
      balance: Math.round(balance * 100) / 100,
      status: balance > 0.01 ? 'owed' : balance < -0.01 ? 'owes' : 'settled',
    })),
    totalExpenses: Math.round(totalExpenses * 100) / 100,
    perPersonAverage: perPersonAvg,
  };
}

export default calculateSettlements;
