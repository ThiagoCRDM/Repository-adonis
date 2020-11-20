'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Repository extends Model {

  static boot () {
    super.boot()
    this.addTrait('@provider:Lucid/Slugify', {
      fields:{ slug: 'slug' },
      strategy: 'dbIncrement'
    })
  }

  users(){
    return this.hasMany('App/Models/User')
  }

  stars(){
    return this.hasMany('App/Models/Star')
  }
}

module.exports = Repository
