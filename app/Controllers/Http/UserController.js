'use strict'

const User = use("App/Models/User")
const Follow = use("App/Models/Follow")
const Database = use('Database')

class UserController {
  
  async index({response}){
    try {
      const users = await User.all()
      const count = await User.getCount()
      return {data: users, count}
    } catch (error) {
      console.error(error);
      return response.status(404).json({error:'Error users not found!'})
    }  
  }

  async store({request, response, auth}){
    const data = request.only(["username", "name", "email", "location", "avatar", "bio"])
    
    try {
      const valid = await Database.from('users')
        .where('username',data.username)
        .orWhere('email', data.email)

      if(valid.length !== 0)
        return response.status(500).json({error:'username or email already registered'})

      const user = await User.create(data)
      return {data: user}
    } catch (error) {
      console.log(error)
      return response.status(500).json({error:'Erro in registered user'})
    }
  }

  async show({params, response}){
    const { id } = params   
    try {  
      const user = await User.find(id)
      if(user == null)
        return response.status(404).json({error:'User not found!'});

      const followers = await Follow.query().where('user_id', id).getCount()
      const  following = await Follow.query().where('following', id).getCount()
      const repositories = await user.repositories().getCount()
     
      return{
        data: user,
        followers, 
        following,  
        repositories
      }
    } catch (error) {
      console.error(error)
      return response.status(500).json({error:'Error fetching user!'});
    }
  }

  async update({params, request, response, auth}){
    const { uid } = auth.jwtPayload
    const { id } = params
    const data = {...request.all()}
    try {
      if(id != uid)
        return response.status(403).json({error: 'Access denied!'})
      
      const isRegistered = await Database.from('users')
        .where('username',data.username)
        
      if(isRegistered.length > 0 && isRegistered[0].id != id)
        return response.status(500).json({error:'Username already registered!'})
        
      const user = await User.findOrFail(id)
      user.merge(data)
      await user.save()
      return {data: user}
    } catch (error) {
      console.error(error)
      return response.status(500).json({error:'Error when changing user!'})
    }
  }

  async destroy({params, response, auth}){
    const { uid } = auth.jwtPayload
    const { id } = params
    
    if(id != uid)
      return response.status(403).json({error: 'Access denied!'})

    const transaction = await Database.beginTransaction()      
    try {
      const user = await User.findOrFail(id)
      await user.tokens().where('user_id', id).delete(transaction)
      await user.delete(transaction)
      transaction.commit()
      return {data: user}    
    } catch (error) {
      transaction.rollback()
      console.error(error)
      return response.status(500).json({error:`User with many relationships. 
        Could not delete user!`})
    }

  }

}

module.exports = UserController
