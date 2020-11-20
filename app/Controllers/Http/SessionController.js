'use strict'

const User = use("App/Models/User")
const Token = use("App/Models/Token")

class SessionController {
  async store({request, response, auth}){
    const {username} = request.all()
    try {    
      const user = await User.findBy('username', username)
      if(user == null)
        return response.status(500).json({error:'Incorrect login!'});
        
      const data = {user_id: user.id}
      await Token.create(data);
      const token = await auth.generate(user)
      return token
    } catch (error) {
      console.log(error)
      return response.status(500).json({error:'Incorrect login!'});
    }

  }
}

module.exports = SessionController
