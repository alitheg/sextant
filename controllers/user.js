const table = 'radcheck'
const attribute = 'Cleartext-Password'
const op = ':='

class UserController {

  constructor(db) {
    this.db = db
  }

  getUserByUsername(username, ...fields) {
    return this.db.select(...fields)
      .from(table)
      .where({attribute, username})
      .first()
  }

  getUserByUsernameAndPassword(username, password, ...fields) {
    return this.db.select(...fields)
      .from(table)
      .where({attribute, value: password, username})
      .first()
  }

  setPassword(username, password) {
    return this.db.table(table)
      .update({value: password})
      .where({attribute, username})
  }

  createUser(username, password) {
    return this.db.table(table)
      .insert({username, attribute, op, value: password})
  }
}

module.exports = (db) => new UserController(db)
module.exports.Class = UserController
