const { createGroup, getGroups, destroyGroup, updateGroup } = require('../Services/GroupServiceProvider.js');
const { getStats } = require('../Services/StatsServiceProvider.js');
const ApiError = require('../utils/ApiError.js');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

const addGroup = catchAsync(async (req, res) => {
  // get userId from request
  const userId = req.user.id;

  // get language package id from params
  const { languagePackageId } = req.params;

  // create language Package
  const group = await createGroup(req.body, userId, languagePackageId);

  res.send(group);
});

const sendGroups = catchAsync(async (req, res) => {
  // get userId from request
  const userId = req.user.id;

  // get language package id from params
  const { languagePackageId } = req.params;

  // decide if we have to fetch stats
  const includeStats = (req.query.stats || false) === 'true';
  const onlyStaged = (req.query.onlyStaged || false) === 'true';
  const onlyActivated = (req.query.onlyActivated || false) === 'true';

  if (onlyStaged && onlyActivated) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'you can not select both onlyStaged and onlyActivated');
  }

  // get groups
  const groups = await getGroups(userId, languagePackageId, onlyStaged, onlyActivated);
  const formatted = await Promise.all(
    groups.map(async (group) => ({
      // if onlyStaged return just group, as response has already been prepared
      ...(onlyStaged || onlyActivated ? group : { ...group.toJSON() }),
      ...(includeStats
        ? {
            stats: await getStats({
              groupId: group.id,
              languagePackageId,
              userId,
            }),
          }
        : {}),
    }))
  );
  res.send(formatted);
});

const deleteGroup = catchAsync(async (req, res) => {
  // get userId from request
  const userId = req.user.id;
  const { groupId } = req.params;

  await destroyGroup(userId, groupId);

  res.status(204).end();
});

const modifyGroup = catchAsync(async (req, res) => {
  // get userId from request
  const userId = req.user.id;
  const { groupId } = req.params;

  await updateGroup(req.body, userId, groupId);

  res.status(204).end();
});

module.exports = {
  addGroup,
  sendGroups,
  deleteGroup,
  modifyGroup,
};
