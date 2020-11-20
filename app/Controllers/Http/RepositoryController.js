'use strict'

const Repository = use("App/Models/Repository")
const Database = use('Database')

class RepositoryController {
 
  async index ({ response, auth }) {
    try {
      const user = await auth.getUser()
      const repositories = await Repository.query().where('user_id', user.id)
        .withCount('stars as stars').fetch()
      const count = await Repository.query().where('user_id', user.id).getCount()
      return {
        data: repositories, 
        count: count
      }
    } catch (error) {
      console.error(error)
      return response.status(404).json({error:'Error repositories not found!'})
    }
  } 
  
  async store ({ request, response, auth }) {
    const data = request.only(["name", "description", "public"])
    try {
      const user = await auth.getUser()
      const repository = new Repository()
      repository.slug = `${user.username} ${data.name}`
      repository.name = data.name
      repository.description = data.description
      repository.public = data.public
      repository.user_id = user.id
      
      await repository.save()
      return {data: repository}
    } catch (error) {
      console.log(error)
      return response.status(500).json({error:'Error in registered repository!'})
    }
  }

  async show ({ params, response }) {
    const {slug} = params
    try{
      const repository = await Repository.findBy('slug', slug)

      if(repository == null)
        return response.status(404).json({error:'Error repository not found!'});

      const count = await repository.stars().where('repository_id', repository.id).getCount()
      return {data:repository, stars: count }
    }catch(error){
     console.log(error)
     return response.status(404).json({error:'Error repository not found!'});
    }
  }

  async update ({ params, request, response }) {
    const { id } = params
    const data = {...request.all()}
    try {
      const repository = await Repository.find(id)
      if(repository == null)
        return response.status(404).json({error:'Repository not found'})

      repository.merge(data)
      await repository.save()
      return {data: repository}
    } catch (error) {
      console.error(error)
      return response.status(500).json('Error when changing repository!')
    }
  }

  async destroy ({ params, response }) {
    const { id } = params
    const transaction = await Database.beginTransaction()
    try {
      const repository = await Repository.find(id)
      if(repository == null)
        return response.status(404).json({error:'Repository not found'})  
      
    await repository.stars() .where('repository_id', repository.id).delete(transaction)
    await repository.delete(transaction)
    transaction.commit()
    return {data: repository}
    } catch (error) {
      transaction.rollback()
      console.error(error)
      return response.status(500).json({error:'Error deleting repository!'})
    }
  }
}

module.exports = RepositoryController
