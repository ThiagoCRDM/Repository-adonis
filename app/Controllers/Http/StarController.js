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
      
      if(isRegistered.length > 0){
        const star = await Star.findBy('repository_id', data.repository_id, 'user_id', user.id )
        if(star == null)
          return response.status(404).json({error:'Stars not found'})
        await star.delete()
        return response.status(200).json({error:'star removed'})

      }

      const star = await Star.create(data)
      return {data: star}
    } catch (error) {
      console.error(error)
      return response.status(500).json({error:'Error in resgistered star'})
    }
  }
}

module.exports = StarController
