'use strict'

const Star = use("App/Models/Star")
const Database = use('Database')

class StarController {
 
  async store ({ request, response, auth}) {
    const {repository_id} = request.only([ "repository_id"])
    const user = await auth.getUser()

    const data = {repository_id, user_id: user.id}
    try {
      const isRegistered = await Database.from('stars')
        .where('repository_id',data.repository_id).where('user_id', data.user_id)
      
      if(isRegistered.length > 0)
        return response.status(500).json({error:'Star already registered'})

      const star = await Star.create(data)
      return {data: star}
    } catch (error) {
      console.error(error)
      return response.status(500).json({error:'Error in resgistered star'})
    }
  }

  async destroy ({ params, response, auth}) {
    const { id } = params
    const user = await auth.getUser()
    try {
      const star = await Star.findBy('repository_id', id, 'user_id', user.id )

      if(star == null)
        return response.status(404).json({error:'Stars not found'})
 
      await star.delete()
      return {data: star}
    } catch (error) {
      console.error(error)
      return response.status(500).json({error:'Error deleting star!'})
    }
  }
}

module.exports = StarController
