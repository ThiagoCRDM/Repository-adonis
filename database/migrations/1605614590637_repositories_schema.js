'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RepositoriesSchema extends Schema {
  up () {
    this.create('repositories', (table) => {
      table.increments()
      table.string('name').notNullable()
      table.text('description').notNullable()
      table.boolean('public').defaultTo(false)
      table.string('slug').notNullable()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.timestamps()
    })
  }

  down () {
    this.drop('repositories')
  }
}

module.exports = RepositoriesSchema
