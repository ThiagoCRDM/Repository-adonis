'use strict'

const Follow = use('App/Models/Follow')
const User = use("App/Models/User")

class FollowingController {

  async index ({response, auth }) {
    const user = await auth.getUser()

    try {
      const followers = await Follow.query().where('following', user.id).fetch()
      const count = await Follow.query().where('following', user.id).getCount()
      const users = []
      for(let i = 0; i < followers.rows.length; i++){
        let idUser = followers.rows[i].user_id
        const userFollower = await User.find(idUser)
        users.push({follower: followers.rows[i], user: userFollower,})
      }
      return {data: users, count: count}
    } catch (error) {
      console.error(error)
      return response.status(404).json({error:'Followers not found'})
    }
    
  }

  async store ({ request, response, auth }) {
    const user = await auth.getUser()
    const {follow} = request.only(["follow"])
    try {
      const follower = await Follow.query().where('user_id', user.id)
      .where( 'following', follow).fetch()

      if(follower.rows.length > 0){
        const follow = await Follow.find(follower.rows[0].id)
        await follow.delete()
        return response.status(500).json({error:'you unfollow'})
      }
      
      const data = await Follow.create({user_id: user.id, following: follow})

      return {data:data}
    } catch (error) {
      console.log(error)
      return response.status(500).json({error:'Error in registered follower'})
    }
  }

}

module.exports = FollowingController
