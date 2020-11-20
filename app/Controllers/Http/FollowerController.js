'use strict'

const Follow = use('App/Models/Follow')
const User = use("App/Models/User")

class FollowerController {
  async index({response, auth}){
    const user = await auth.getUser()

    try {
      const followers = await Follow.query().where('user_id', user.id).fetch()
      const count = await Follow.query().where('user_id', user.id).getCount()
      const users = []
      for(let i = 0; i < followers.rows.length; i++){
        let idUser = followers.rows[i].following
        const userFollower = await User.find(idUser)
        users.push({follower: followers.rows[i], user: userFollower,})
      }
      return {data: users, count: count}
    } catch (error) {
      console.error(error)
      return response.status(404).json({error:'Followers not found'})
    }
    
  }

  async show({params, response}){
    const { id } = params
    try {
      const follow = await Follow.find(id)
      if(follow == null)
        return response.status(404).json({error:'Follower not found'})

      const userFollower = await User.findOrFail(follow.user_id)
      const following = await Follow.query().where('following', follow.following).getCount()
      const follower = await Follow.query().where('user_id', follow.following).getCount()
      const repositories = await userFollower.repositories().getCount()
      return {
        data: userFollower,
        follower, 
        following,  
        repositories
      }
    } catch (error) {
      console.error(error)
      return response.status(404).json({error:'Follower not found'})
    }    
  }

}

module.exports = FollowerController
