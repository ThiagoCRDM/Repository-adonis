'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Follow extends Model {
  users(){
    return this.hasMany('App/Model/User')
  }
}

module.exports = Follow
