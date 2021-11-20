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
  let maxUses = null;
  let expirationDate = null;

  if (req.body.maxUses) {
    maxUses = parseInt(req.body.maxUses, 10);

    if (Number.isNaN(maxUses) || maxUses <= 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'invalid number', 'maxUses');
    }
  }

  if (req.body.expirationDate) {
    expirationDate = new Date(req.body.expirationDate);

    if (Number.isNaN(expirationDate.getTime()) || expirationDate < new Date()) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'invalid date', 'expirationDate');
    }
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
