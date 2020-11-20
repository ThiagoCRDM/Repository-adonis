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

}

module.exports = FollowerController
