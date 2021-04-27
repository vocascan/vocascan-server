const { getUserStats } = require('../Services/StatsServiceProvider.js');
const catchAsync = require('../utils/catchAsync');

const sendAccountStats = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const stats = await getUserStats({ userId });

  res.send(stats);
});

module.exports = {
  sendAccountStats,
};
