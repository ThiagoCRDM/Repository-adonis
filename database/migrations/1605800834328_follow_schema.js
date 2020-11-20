'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FollowSchema extends Schema {
  up () {
    this.create('follows', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('following').unsigned().references('id').inTable('users')
      table.timestamps()
    })
  }

  down () {
    this.drop('follows')
  }
}

module.exports = FollowSchema
