const {
  createInviteCode,
  destroyInviteCode,
  getInviteCodes,
  validateInviteCode,
} = require('../Services/InviteCodeProvider.js');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError.js');
const httpStatus = require('http-status');

const addInviteCode = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const maxUses = Number(req.body.maxUses) || null;

  if (maxUses <= 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'wrong input for maxUses');
  }
  // if no date is given, standart expiration date is 1 day
  const expirationDate = new Date(req.body.expirationDate) || new Date().setDate(new Date().getDate() + 1);

  console.log(expirationDate);

  if (Number.isNaN(expirationDate.getTime())) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'wrong time format');
  }

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

  res.send({ usable });
});

module.exports = {
  addInviteCode,
  deleteInviteCode,
  sendInviteCodes,
  checkInviteCode,
};
