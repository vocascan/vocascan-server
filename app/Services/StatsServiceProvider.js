const { Op } = require('sequelize');
const { LanguagePackage, Group, VocabularyCard, Drawer, PackageProgress, sequelize } = require('../../database');
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
      ...(languagePackageId ? { languagePackageId } : {}),
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
      // if queryDate is less than lastQueryCorrect -> still time
      // if queryDate more than lastQueryCorrect -> waiting time is over

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
          lastQueryCorrect: { [Op.lt]: queryDate },
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
      ...(groupId ? { groupId } : {}),
      ...(languagePackageId ? { languagePackageId } : {}),
      userId,
      '$Drawer.stage$': 0,
      active: true,
    },
  });

  return number;
}

// get number of today learned vocabs
async function getNumberOfLearnedTodayVocabulary({ languagePackageId = null, userId }) {
  const languagePackage = await LanguagePackage.findOne({
    attributes: languagePackageId
      ? ['vocabsPerDay']
      : [[sequelize.fn('sum', sequelize.col('vocabsPerDay')), 'vocabsPerDay']],
    where: {
      ...(languagePackageId ? { id: languagePackageId } : {}),
      userId,
    },
  });

  if (!languagePackage) {
    throw new ApiError(httpStatus.NOT_FOUND, 'languagePackage not found');
  }

  const number = await PackageProgress.findOne({
    attributes: languagePackageId
      ? [
          ['learnedTodayCorrect', 'correct'],
          ['learnedTodayWrong', 'wrong'],
        ]
      : [
          [sequelize.fn('sum', sequelize.col('learnedTodayCorrect')), 'correct'],
          [sequelize.fn('sum', sequelize.col('learnedTodayWrong')), 'wrong'],
        ],
    where: {
      userId,
      date: new Date(),
      ...(languagePackageId ? { languagePackageId } : {}),
    },
  });

  if (number) {
    const progress = number.toJSON();

    if (progress.correct !== null && progress.wrong !== null) {
      const dueToday = languagePackage.vocabsPerDay - progress.correct;

      return {
        dueToday: dueToday > 0 ? dueToday : 0,
        ...progress,
      };
    }
  }

  return {
    dueToday: languagePackage.vocabsPerDay,
    correct: 0,
    wrong: 0,
  };
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
      unresolved: getNumberOfUnresolvedVocabulary({ userId }),
      unactivated: getNumberOfUnactivatedVocabulary({ userId }),
      learnedToday: getNumberOfLearnedTodayVocabulary({ userId }),
    }),
  });

  // set dueToday not bigger than unresolved
  /* TODO: fix this in another pull request because for now another package
           with less vocab can cover a package with more vocabs to resolve */
  if (stats.vocabularies.unresolved < stats.vocabularies.learnedToday.dueToday) {
    stats.vocabularies.learnedToday.dueToday = stats.vocabularies.unresolved;
  }

  return stats;
}

// get stats for groups or packages
async function getStats({ languagePackageId, groupId, userId }) {
  const stats = await promiseAllValues({
    vocabularies: promiseAllValues({
      all: getNumberOfVocabulary({ languagePackageId, groupId, userId }),
      active: getNumberOfVocabulary({ languagePackageId, groupId, userId, active: true }),
      inactive: getNumberOfVocabulary({ languagePackageId, groupId, userId, active: false }),
      unresolved: getNumberOfUnresolvedVocabulary({ languagePackageId, groupId, userId }),
      unactivated: getNumberOfUnactivatedVocabulary({ languagePackageId, groupId, userId }),
      ...(!groupId ? { learnedToday: getNumberOfLearnedTodayVocabulary({ languagePackageId, userId }) } : {}),
    }),
  });

  // set dueToday not bigger than unresolved
  if (!groupId && stats.vocabularies.unresolved < stats.vocabularies.learnedToday.dueToday) {
    stats.vocabularies.learnedToday.dueToday = stats.vocabularies.unresolved;
  }

  return stats;
}

module.exports = {
  getNumberOfLanguagePackages,
  getNumberOfGroups,
  getNumberOfVocabulary,
  getNumberOfUnresolvedVocabulary,
  getNumberOfUnactivatedVocabulary,
  getNumberOfLearnedTodayVocabulary,
  getUserStats,
  getStats,
};
