const Repayment = require('../models/Repayment');
const User = require('../models/User');

const processOverdueRepayments = async () => {
  try {
    const now = new Date();
    const overdue = await Repayment.find({ status: 'pending', dueDate: { $lt: now } });
    for (const r of overdue) {
      const borrower = await User.findById(r.borrowerId);
      const helper = await User.findById(r.helperId);
      if (!borrower || !helper) continue;

      if ((borrower.walletBalance || 0) >= r.amount) {
        borrower.walletBalance -= r.amount;
        helper.walletBalance = (helper.walletBalance || 0) + r.amount;
        await borrower.save();
        await helper.save();
        r.status = 'completed';
        r.paidDate = new Date();
      } else {
        r.status = 'failed';
      }
      await r.save();
    }
  } catch (e) {
    console.error('Auto-repayment processing error:', e?.message || e);
  }
};

setInterval(processOverdueRepayments, 60 * 60 * 1000);

