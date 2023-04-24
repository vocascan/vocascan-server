const testee = require('../app/Controllers/AuthController.js');
const ApiError = require('../app/utils/ApiError');
const httpStatus = require('http-status');
const config = require('../app/config/config');
const { generateJWT } = require('../app/utils');
const { sendMail } = require('../app/config/mailer');
const { User, InviteCode, Role } = require('../database');

jest.mock('../app/config/config', () => ({
  service: {},
  server: {},
  log: {
    console: {
      level: 'info',
      colorize: true,
      enable_sql_log: true,
      enable_router_log: true,
      stderr_levels: ['error'],
    },
  },
}));

jest.mock('../database', () => ({
  Role: {
    findOne: jest.fn(),
  },
  User: {
    create: jest.fn(),
    findOne: jest.fn(),
    count: jest.fn(),
    toJSON: jest.fn(),
  },
  InviteCode: {
    findOne: jest.fn(),
    update: jest.fn(),
  },
}));

jest.mock('../app/config/mailer', () => {
  const original = jest.requireActual('../app/config/mailer');
  return {
    ...original,
    sendMail: jest.fn(),
  };
});

jest.mock('../app/utils', () => {
  const original = jest.requireActual('../app/utils');
  return {
    ...original,
    generateJWT: jest.fn(),
  };
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Registration', () => {
  describe('when server is locked', () => {
    describe('and when request is invalid', () => {
      test('should fail because invite code is missing', (done) => {
        // given
        config.service.invite_code = 'code';
        const request = createRequest({
          email: 'test@test.com',
          password: 'aPassw0rd',
          username: 'username',
          inviteCode: undefined,
        });

        // when + then
        testee.register(request, undefined, (error) => {
          expect(error).toStrictEqual(new ApiError(httpStatus.NOT_FOUND, 'Locked Server! Invite Code is missing'));
          done();
        });
      });

      test('should fail because invite code is invalid', (done) => {
        // given
        config.service.invite_code = 'code';
        InviteCode.findOne.mockImplementation(() => undefined);
        const request = createRequest({
          email: 'test@test.com',
          password: 'aPassw0rd',
          username: 'username',
          inviteCode: 'otherCode',
        });

        // when + then
        testee.register(request, undefined, (error) => {
          expect(error).toStrictEqual(new ApiError(httpStatus.CONFLICT, 'Invite code does not exist', 'notExisting'));
          done();
        });
      });

      test('should fail because no invites left', (done) => {
        // given
        config.service.invite_code = 'code';
        InviteCode.findOne.mockImplementation(() => createInviteCode(1, 1));
        const request = createRequest({
          email: 'test@test.com',
          password: 'aPassw0rd',
          username: 'username',
          inviteCode: 'code',
        });

        // when + then
        testee.register(request, undefined, (error) => {
          expect(error).toStrictEqual(new ApiError(httpStatus.CONFLICT, 'No invites left', 'used'));
          done();
        });
      });

      test('should fail because invite code is expired', (done) => {
        // given
        config.service.invite_code = 'code';
        InviteCode.findOne.mockReturnValueOnce(createInviteCode(1, 0, Date.now() - 1));
        const request = createRequest({
          email: 'test@test.com',
          password: 'aPassw0rd',
          username: 'username',
          inviteCode: 'code',
        });

        // when + then
        testee.register(request, undefined, (error) => {
          expect(error).toStrictEqual(new ApiError(httpStatus.CONFLICT, 'Invite code expired', 'expired'));
          done();
        });
      });
    });

    describe('and when request is valid', () => {
      test('should register a new user and increment invite code usage', (done) => {
        // given
        config.service.invite_code = 'code';
        config.server.salt_rounds = 1;
        config.server.jwt_secret = 'secret';
        const request = createRequest({
          email: 'test@test.com',
          password: 'aPassw0rd',
          username: 'username',
          inviteCode: 'code',
        });
        User.count.mockReturnValueOnce(0).mockReturnValueOnce(0);
        User.create.mockReturnValueOnce(createUser('username', 'test@test.com', 'aPassw0rd', 1, createRole(1)));
        User.findOne.mockReturnValueOnce(createUser('username', 'test@test.com', 'aPassw0rd', 1, createRole(1)));
        Role.findOne.mockReturnValueOnce(createRole(1));
        InviteCode.findOne.mockReturnValueOnce(createInviteCode(1, 0, Date.now() + 1));
        InviteCode.update.mockReturnValueOnce(1);
        generateJWT.mockReturnValueOnce('aToken');
        const response = {
          send: ({ token, user }) => {
            expect(token).toStrictEqual('aToken');
            expect(user).toStrictEqual({ username: 'username', isAdmin: false });
            expect(User.create).toBeCalledTimes(1);
            expect(InviteCode.update).toBeCalledTimes(1);
            done();
          },
        };

        // when + then
        testee.register(request, response, (e) => {
          console.log('ok');
          throw e;
        });
      });
    });
  });

  describe('when server is locked or unlocked', () => {
    describe('and when request is invalid', () => {
      test('should fail because email is missing', (done) => {
        // given
        config.service.invite_code = undefined;
        const request = createRequest({ email: undefined, password: 'aPassw0rd', username: 'username' });

        // when + then
        testee.register(request, undefined, (error) => {
          expect(error).toStrictEqual(new ApiError(httpStatus.BAD_REQUEST, 'missing parameter'));
          done();
        });
      });

      test('should fail because password is missing', (done) => {
        // given
        config.service.invite_code = undefined;
        const request = createRequest({ email: 'test@test.com', password: undefined, username: 'username' });

        // when + then
        testee.register(request, undefined, (error) => {
          expect(error).toStrictEqual(new ApiError(httpStatus.BAD_REQUEST, 'missing parameter'));
          done();
        });
      });

      test('should fail because email is invalidly formatted', (done) => {
        // given
        config.service.invite_code = undefined;
        const request = createRequest({ email: 'test.com', password: 'aPassword', username: 'username' });

        // when + then
        testee.register(request, undefined, (error) => {
          expect(error).toStrictEqual(new ApiError(httpStatus.BAD_REQUEST, 'email is not valid', 'email'));
          done();
        });
      });

      test('should fail because email is already taken', (done) => {
        // given
        config.service.invite_code = undefined;
        const request = createRequest({
          email: 'test@test.com',
          password: 'aPassword',
          username: 'username',
        });
        User.count.mockReturnValueOnce(1);

        // when + then
        testee.register(request, undefined, (error) => {
          expect(error).toStrictEqual(new ApiError(httpStatus.CONFLICT, 'email already in use', 'email'));
          done();
        });
      });

      test('should fail because username is already taken', (done) => {
        // given
        config.service.invite_code = undefined;
        const request = createRequest({
          email: 'test@test.com',
          password: 'aPassword',
          username: 'username',
        });
        User.count.mockReturnValueOnce(0).mockReturnValueOnce(1);

        // when + then
        testee.register(request, undefined, (error) => {
          expect(error).toStrictEqual(new ApiError(httpStatus.CONFLICT, 'username is already taken', 'username'));
          done();
        });
      });

      describe('and when password is not strong enough', () => {
        test('should fail because length is smaller than 8', (done) => {
          // given
          config.service.invite_code = undefined;
          const request = createRequest({
            email: 'test@test.com',
            password: '1234567',
            username: 'username',
          });
          User.count.mockReturnValueOnce(0).mockReturnValueOnce(0);

          // when + then
          testee.register(request, undefined, (error) => {
            expect(error).toStrictEqual(new ApiError(httpStatus.BAD_REQUEST, 'password complexity failed', 'password'));
            done();
          });
        });

        test('should fail because length is greater than 72', (done) => {
          // given
          config.service.invite_code = undefined;
          const request = createRequest({
            email: 'test@test.com',
            password: 'a'.repeat(100),
            username: 'username',
          });
          User.count.mockReturnValueOnce(0).mockReturnValueOnce(0);

          // when + then
          testee.register(request, undefined, (error) => {
            expect(error).toStrictEqual(new ApiError(httpStatus.BAD_REQUEST, 'password complexity failed', 'password'));
            done();
          });
        });

        test('should fail because complexity is to low', (done) => {
          // given
          config.service.invite_code = undefined;
          const request = createRequest({
            email: 'test@test.com',
            password: '12345678',
            username: 'username',
          });
          User.count.mockReturnValueOnce(0).mockReturnValueOnce(0);

          // when + then
          testee.register(request, undefined, (error) => {
            expect(error).toStrictEqual(new ApiError(httpStatus.BAD_REQUEST, 'password complexity failed', 'password'));
            done();
          });
        });
      });
    });

    describe('and when request is valid', () => {
      describe('and when user should receive an email', () => {
        test('should register a new user and send a mail', (done) => {
          // given
          config.service.invite_code = undefined;
          config.server.salt_rounds = 1;
          config.server.jwt_secret = 'secret';
          config.service.email_confirm = true;
          const request = createRequest({
            email: 'test@test.com',
            password: 'aPassw0rd',
            username: 'username',
          });
          User.count.mockReturnValueOnce(0).mockReturnValueOnce(0);
          User.create.mockReturnValueOnce(createUser('username', 'test@test.com', 'aPassw0rd', 1, createRole(1)));
          User.findOne.mockReturnValueOnce(createUser('username', 'test@test.com', 'aPassw0rd', 1, createRole(1)));
          Role.findOne.mockReturnValueOnce(createRole(1));
          sendMail.mockImplementationOnce(() => {});
          generateJWT.mockReturnValueOnce('aToken');
          const response = {
            send: ({ token, user }) => {
              expect(token).toStrictEqual('aToken');
              expect(user).toStrictEqual({ username: 'username', isAdmin: false });
              expect(User.create).toBeCalledTimes(1);
              expect(sendMail).toBeCalledTimes(1);
              done();
            },
          };

          // when + then
          testee.register(request, response, (e) => {
            throw e;
          });
        });
      });

      test('should register a new user', (done) => {
        // given
        config.service.invite_code = undefined;
        config.server.salt_rounds = 1;
        config.server.jwt_secret = 'secret';
        const request = createRequest({
          email: 'test@test.com',
          password: 'aPassw0rd',
          username: 'username',
        });
        User.count.mockReturnValueOnce(0).mockReturnValueOnce(0);
        User.create.mockReturnValueOnce(createUser('username', 'test@test.com', 'aPassw0rd', 1, createRole(1)));
        User.findOne.mockReturnValueOnce(createUser('username', 'test@test.com', 'aPassw0rd', 1, createRole(1)));
        Role.findOne.mockReturnValueOnce(createRole(1));
        generateJWT.mockReturnValueOnce('aToken');
        const response = {
          send: ({ token, user }) => {
            expect(token).toStrictEqual('aToken');
            expect(user).toStrictEqual({ username: 'username', isAdmin: false });
            expect(User.create).toBeCalledTimes(1);
            done();
          },
        };

        // when + then
        testee.register(request, response, (e) => {
          throw e;
        });
      });
    });
  });
});

function createRequest({ email, password, inviteCode, username }) {
  return {
    body: {
      email,
      password,
      username,
    },
    query: {
      inviteCode,
    },
  };
}

function createInviteCode(maxUses, uses, expirationDate) {
  return {
    maxUses,
    uses,
    expirationDate,
  };
}

function createUser(username, email, password, roleId, Role) {
  return {
    username,
    email,
    password,
    roleId,
    Role,
    toJSON: () => ({
      username,
      email,
      password,
      roleId,
    }),
  };
}

function createRole(id) {
  return {
    id,
    adminRights: false,
  };
}
