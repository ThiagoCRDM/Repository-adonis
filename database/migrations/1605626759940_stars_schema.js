'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StarsSchema extends Schema {
  up () {
    this.create('stars', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('repository_id').unsigned().references('id').inTable('repositories')
      table.timestamps()
    })
  }

  down () {
    this.drop('stars')
  }
}

module.exports = StarsSchema
