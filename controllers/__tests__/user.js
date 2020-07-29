const faker = require('faker');
const knex = require('knex');
const mockDb = require('mock-knex');
const db = knex({
    client: 'sqlite',
    useNullAsDefault: true
});
mockDb.mock(db);
const tracker = mockDb.getTracker();

const UserController = require('../user')
const { Class } = require('../user')

describe('User Controller factory', () => {
  beforeEach(() => {
  });
  it('should create a new user controller', () => {
    const controller = UserController(db)
    expect(controller).toBeInstanceOf(Class)
    expect(controller.db).toEqual(db)
  });
})

describe('User Controller', () => {
  const controller = UserController(db);
  beforeEach(() => {
    tracker.uninstall()
    tracker.install()
  });
  it('should be able to get a user by username', async () => {
    const username = faker.internet.userName()
    const expected = faker.lorem.words()
    const callback = jest.fn().mockImplementation(query => {
      expect(query.method).toEqual('first');
      expect(query.bindings).toEqual(expect.arrayContaining([username, 'Cleartext-Password']));
      expect(query.sql).toContain('from `radcheck` where')
      query.response(expected);
    })
    tracker.on('query', callback);
    let actual = await controller.getUserByUsername(username);
    expect(callback).toHaveBeenCalledTimes(1)
    expect(actual).toEqual(expected)
  })
  it('should be able to get a user by username and password', async () => {
    const username = faker.internet.userName()
    const password = faker.internet.password()
    const expected = faker.lorem.words()
    const callback = jest.fn().mockImplementation(query => {
      expect(query.method).toEqual('first');
      expect(query.bindings).toEqual(expect.arrayContaining([username, password, 'Cleartext-Password']));
      expect(query.sql).toContain('from `radcheck` where')
      query.response(expected);
    })
    tracker.on('query', callback);
    let actual = await controller.getUserByUsernameAndPassword(username, password);
    expect(callback).toHaveBeenCalledTimes(1)
    expect(actual).toEqual(expected)
  })
  it('should be able to update a password', async () => {
    const username = faker.internet.userName()
    const password = faker.internet.password()
    const expected = faker.lorem.words()
    const callback = jest.fn().mockImplementation(query => {
      expect(query.method).toEqual('update');
      expect(query.bindings).toEqual(expect.arrayContaining([username, password, 'Cleartext-Password']));
      expect(query.sql).toContain('update `radcheck` set `value`')
      query.response(expected);
    })
    tracker.on('query', callback);
    let actual = await controller.setPassword(username, password);
    expect(callback).toHaveBeenCalledTimes(1)
    expect(actual).toEqual(expected)
  })
  it('should be able to create a user', async () => {
    const username = faker.internet.userName()
    const password = faker.internet.password()
    const expected = faker.lorem.words()
    const callback = jest.fn().mockImplementation(query => {
      expect(query.method).toEqual('insert');
      expect(query.bindings).toEqual(expect.arrayContaining([username, password, 'Cleartext-Password', ':=']));
      expect(query.sql).toContain('insert into `radcheck`')
      query.response(expected);
    })
    tracker.on('query', callback);
    let actual = await controller.createUser(username, password);
    expect(callback).toHaveBeenCalledTimes(1)
    expect(actual).toEqual(expected)
  })
})
