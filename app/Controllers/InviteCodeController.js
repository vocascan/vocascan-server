const { createInviteCode, destroyInviteCode, getInviteCodes } = require('../Services/InviteCodeProvider.js');
const catchAsync = require('../utils/catchAsync');

const addInviteCode = catchAsync(async (req, res) => {
  const maxUses = req.query.maxUses || null;
  const expirationDate = req.query.expirationDate || null;

  const inviteCode = await createInviteCode({ maxUses, expirationDate });

  res.send(inviteCode);
});

const deleteInviteCode = catchAsync(async (req, res) => {
  const { inviteCode } = req.params;

  await destroyInviteCode(inviteCode);

  res.status(204).end();
});

const sendInviteCodes = catchAsync(async (req, res) => {
  const inviteCodes = await getInviteCodes();

  res.send(inviteCodes);
});

module.exports = {
  addInviteCode,
  deleteInviteCode,
  sendInviteCodes,
};
