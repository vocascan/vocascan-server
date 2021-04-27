const { Op } = require('sequelize');
const { LanguagePackage, Group, VocabularyCard, Drawer } = require('../../database');
const { shiftDate, promiseAllValues } = require('../utils/index.js');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

async function getNumberOfLanguagePackages({ userId }) {
  const number = await LanguagePackage.count({
    where: {
      userId,
    },
  });
  return number;
}

async function getNumberOfGroups({ userId, active = null }) {
  const number = await Group.count({
    where: {
      userId,
      ...(active ? { active: true } : {}),
    },
  });
  return number;
}

async function getNumberOfVocabulary({ active = null, languagePackageId, groupId, userId }) {
  const number = await VocabularyCard.count({
    include:
      active !== null
        ? [
            {
              model: Group,
              attributes: ['active'],
            },
          ]
        : [],
    where: {
      userId,

      ...(() => {
        // only add active filter if active is defined
        if (active !== null) {
          // filter active vocabs
          if (active) {
            return {
              active: true,
              '$Group.active$': true,
            };
          }

          // filter inactive vocabs
          return {
            [Op.or]: [{ active: false }, { '$Group.active$': false }],
          };
        }

        // no active filter
        return {};
      })(),

      ...(groupId ? { groupId } : {}),
      ...(languagePackageId ? { languagePackageId } : {}),
    },
  });
  return number;
}

// return the number of unresolved vocabulary
async function getNumberOfUnresolvedVocabulary({ languagePackageId, groupId, userId }) {
  // Get drawers belonging to languagePackage
  const drawers = await Drawer.findAll({
    attributes: ['id', 'stage', 'queryInterval'],
    where: {
      userId,
      languagePackageId,
      stage: {
        [Op.ne]: 0,
      },
    },
  });

  if (drawers.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'no drawers found, because the language package does not exist');
  }

  let number = 0;

  await Promise.all(
    drawers.map(async (drawer) => {
      // subtract query interval from actual date
      const queryDate = shiftDate(new Date(), -drawer.queryInterval);

      // compare query date with with last query
      // if queryDate is less than lastQuery: still time
      // if queryDate more than lastQuery: waiting time is over

      const result = await VocabularyCard.count({
        include: [
          {
            model: Group,
            attributes: ['active'],
          },
        ],
        where: {
          drawerId: drawer.id,
          ...(groupId ? { groupId } : {}),
          lastQuery: { [Op.lt]: queryDate },
          '$Group.active$': true,
          active: true,
        },
      });
      number += Number(result);
    })
  );

  return number;
}

// return the number of unactivated vocabulary
async function getNumberOfUnactivatedVocabulary({ languagePackageId, groupId, userId }) {
  // Get number of vocabularies belonging to languagePackage
  const number = await VocabularyCard.count({
    include: [
      {
        model: Drawer,
        attributes: ['stage'],
        required: true,
      },
    ],
    where: {
      languagePackageId,
      ...(groupId ? { groupId } : {}),
      userId,
      '$Drawer.stage$': 0,
      active: true,
    },
  });

  return number;
}

// get user stats
async function getUserStats({ userId }) {
  const stats = await promiseAllValues({
    languagePackages: promiseAllValues({
      all: getNumberOfLanguagePackages({ userId }),
    }),

    groups: promiseAllValues({
      all: getNumberOfGroups({ userId }),
      active: getNumberOfGroups({ userId, active: true }),
      inactive: getNumberOfGroups({ userId, active: false }),
    }),

    vocabularies: promiseAllValues({
      all: getNumberOfVocabulary({ userId }),
      active: getNumberOfVocabulary({ userId, active: true }),
      inactive: getNumberOfVocabulary({ userId, active: false }),
    }),
  });

  return stats;
}

// get stats for groups or packages
async function getStats({ languagePackageId, groupId, userId }) {
  const stats = promiseAllValues({
    vocabularies: promiseAllValues({
      all: getNumberOfVocabulary({ languagePackageId, groupId, userId }),
      active: getNumberOfVocabulary({ languagePackageId, groupId, userId, active: true }),
      inactive: getNumberOfVocabulary({ languagePackageId, groupId, userId, active: false }),
      unresolved: getNumberOfUnresolvedVocabulary({ languagePackageId, groupId, userId }),
      unactivated: getNumberOfUnactivatedVocabulary({ languagePackageId, groupId, userId }),
    }),
  });

  return stats;
}

module.exports = {
  getNumberOfLanguagePackages,
  getNumberOfGroups,
  getNumberOfVocabulary,
  getNumberOfUnresolvedVocabulary,
  getNumberOfUnactivatedVocabulary,
  getUserStats,
  getStats,
};
