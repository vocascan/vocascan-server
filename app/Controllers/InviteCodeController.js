const {
  createInviteCode,
  destroyInviteCode,
  getInviteCodes,
  validateInviteCode,
} = require('../Services/InviteCodeProvider.js');
const catchAsync = require('../utils/catchAsync');

const addInviteCode = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const maxUses = req.body.maxUses || null;
  // if no date is given, standart expiration date is 1 day
  const expirationDate = new Date(req.body.expirationDate) || new Date().setDate(new Date().getDate() + 1);

  const inviteCode = await createInviteCode({ userId, maxUses, expirationDate });

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

const checkInviteCode = catchAsync(async (req, res) => {
  const usable = await validateInviteCode(req.params.inviteCode);

  res.send(usable);
});

module.exports = {
  addInviteCode,
  deleteInviteCode,
  sendInviteCodes,
  checkInviteCode,
};
