'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Star extends Model {
  users(){
    return this.hasMany('App/Model/User')
  }

  repositories(){
    return this.hasMany('App/Model/Repository')
  }

}

module.exports = Star
