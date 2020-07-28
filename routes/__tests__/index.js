const request = require('supertest')
const faker = require('faker');
const config = require('config');
const JWT = require('jsonwebtoken');

const UserController = require('../../controllers/user');
const app = require('../../app')
var mockController = jest.fn();
jest.mock('../../controllers/user', () => {
  return jest.fn().mockImplementation(() => {
    return mockController;
  });
});

describe('API', () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    mockController = {
      getUserByUsername: jest.fn().mockImplementation(() => new Promise((resolve, reject) => {
        return resolve(jest.fn())
      })),
      getUserByUsernameAndPassword: jest.fn().mockImplementation(() => new Promise((resolve, reject) => {
        return resolve(jest.fn())
      })),
      setPassword: jest.fn().mockImplementation(() => new Promise((resolve, reject) => {
        return resolve(jest.fn())
      })),
      createUser: jest.fn().mockImplementation(() => new Promise((resolve, reject) => {
        return resolve(jest.fn())
      })),
    }
    for(let k of Object.keys(UserController())) {
      UserController()[k].mockClear()
    }
    UserController.mockClear();
  });
  it('should allow users to log in', async () => {
    const username = faker.internet.userName()
    const password = faker.internet.password()
    const res = await request(app)
      .post('/api/login')
      .send({username, password})
    expect(res.statusCode).toEqual(200)
    expect(mockController.getUserByUsernameAndPassword).toHaveBeenCalledTimes(1);
    expect(mockController.getUserByUsernameAndPassword).toHaveBeenCalledWith(username, password, "username");
    expect(res.body).toHaveProperty('username')
    expect(res.body.username).toEqual(username)
    expect(res.headers["set-cookie"][0]).toContain('_radiusManagementSessionToken')
  });
  it('should throw an error on invalid user or password', async () => {
    mockController.getUserByUsernameAndPassword = jest.fn().mockImplementation(() => new Promise((resolve, reject) => {
      return resolve(null)
    }))
    const username = faker.internet.userName()
    const password = faker.internet.password()
    const res = await request(app)
      .post('/api/login')
      .send({username, password})
    expect(res.statusCode).toEqual(404)
    expect(mockController.getUserByUsernameAndPassword).toHaveBeenCalledTimes(1);
    expect(mockController.getUserByUsernameAndPassword).toHaveBeenCalledWith(username, password, "username");
  });
  it('should allow anonymous users to reset their password', async () => {
    const username = faker.internet.userName()
    const password = faker.internet.password()
    const currentPassword = faker.internet.password()
    const res = await request(app)
      .post('/api/update')
      .send({username, password, currentPassword})
    expect(res.statusCode).toEqual(200)
    expect(mockController.getUserByUsernameAndPassword).toHaveBeenCalledTimes(1);
    expect(mockController.getUserByUsernameAndPassword).toHaveBeenCalledWith(username, currentPassword, "username");
    expect(mockController.setPassword).toHaveBeenCalledTimes(1);
    expect(mockController.setPassword).toHaveBeenCalledWith(username, password);
    expect(res.text).toEqual('success')
  });
  it('should allow logged-in, authorised users to reset a password', async () => {
    const username = 'alastair' // TODO: make dynamic
    const password = faker.internet.password()
    const currentPassword = faker.internet.password()
    const authToken = JWT.sign(
      Object.assign({username}, {
        iss: config.get("jwt.issuer"),
        aud: config.get("jwt.audience")
      }),
      config.get("jwt.secret")
    )
    const res = await request(app)
      .post('/api/admin_update')
      .set('Cookie', [`_radiusManagementSessionToken=${authToken}`])
      .send({username, password})
    expect(res.statusCode).toEqual(200)
    expect(mockController.getUserByUsername).toHaveBeenCalledTimes(1);
    expect(mockController.getUserByUsername).toHaveBeenCalledWith(username, "username");
    expect(mockController.setPassword).toHaveBeenCalledTimes(1);
    expect(mockController.setPassword).toHaveBeenCalledWith(username, password);
    expect(res.text).toEqual('success')
  });
  it('should deny unauthorised users from resetting a password', async () => {
    const username = faker.internet.userName()
    const password = faker.internet.password()
    const currentPassword = faker.internet.password()
    const authToken = JWT.sign(
      Object.assign({username}, {
        iss: config.get("jwt.issuer"),
        aud: config.get("jwt.audience")
      }),
      config.get("jwt.secret")
    )
    const res = await request(app)
      .post('/api/admin_update')
      .set('Cookie', [`_radiusManagementSessionToken=${authToken}`])
      .send({username, password})
    expect(res.statusCode).toEqual(401)
    expect(mockController.setPassword).toHaveBeenCalledTimes(0);
  });
  it('should allow logged-in, authorised users to create a new user', async () => {
    mockController.getUserByUsername = jest.fn().mockImplementation(() => new Promise((resolve, reject) => {
      return resolve(null)
    }))
    const username = 'alastair' // TODO: make dynamic
    const password = faker.internet.password()
    const currentPassword = faker.internet.password()
    const authToken = JWT.sign(
      Object.assign({username}, {
        iss: config.get("jwt.issuer"),
        aud: config.get("jwt.audience")
      }),
      config.get("jwt.secret")
    )
    const res = await request(app)
      .post('/api/admin_create')
      .set('Cookie', [`_radiusManagementSessionToken=${authToken}`])
      .send({username, password})
    expect(res.statusCode).toEqual(200)
    expect(mockController.getUserByUsername).toHaveBeenCalledTimes(1);
    expect(mockController.getUserByUsername).toHaveBeenCalledWith(username, "username");
    expect(mockController.createUser).toHaveBeenCalledTimes(1);
    expect(mockController.createUser).toHaveBeenCalledWith(username, password);
    expect(res.text).toEqual('success')
  });
  it('should prevent creation of a user who already exists', async () => {
    const username = 'alastair' // TODO: make dynamic
    const password = faker.internet.password()
    const currentPassword = faker.internet.password()
    const authToken = JWT.sign(
      Object.assign({username}, {
        iss: config.get("jwt.issuer"),
        aud: config.get("jwt.audience")
      }),
      config.get("jwt.secret")
    )
    const res = await request(app)
      .post('/api/admin_create')
      .set('Cookie', [`_radiusManagementSessionToken=${authToken}`])
      .send({username, password})
    expect(res.statusCode).toEqual(500) // TODO: Change response code
    expect(mockController.getUserByUsername).toHaveBeenCalledTimes(1);
    expect(mockController.getUserByUsername).toHaveBeenCalledWith(username, "username");
    expect(mockController.createUser).toHaveBeenCalledTimes(0);
  });
  it('should deny unauthorised users from creating a user', async () => {
    const username = faker.internet.userName()
    const password = faker.internet.password()
    const currentPassword = faker.internet.password()
    const authToken = JWT.sign(
      Object.assign({username}, {
        iss: config.get("jwt.issuer"),
        aud: config.get("jwt.audience")
      }),
      config.get("jwt.secret")
    )
    const res = await request(app)
      .post('/api/admin_create')
      .set('Cookie', [`_radiusManagementSessionToken=${authToken}`])
      .send({username, password})
    expect(res.statusCode).toEqual(401)
    expect(mockController.createUser).toHaveBeenCalledTimes(0);
  });
})
