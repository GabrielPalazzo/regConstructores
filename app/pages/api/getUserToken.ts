import axios from 'axios'
import { signToken } from '../../middlewares/checkJwt'
import moment from 'moment'
import { access } from 'fs'

export default (req, res) => {
  res.statusCode = 200
  axios.get(process.env.OPENID_USERDATA,{
        headers: {
          "authorization":`Bearer ${req.body.access_token}`
        }
      }).then(result => {
        res.json(signToken({
          iat: parseInt(moment().format("X"),10),
          cuit:result.data.cuit,
          GivenName: result.data.given_name || '',
          Surname: result.data.family_name || '',
          email:'',
          sub:result.data.sub,
          Role:['CONSTRUCTOR']
        }))
      })
      .catch( err => {
        res.statusCode=403
        res.json({sucess:false,message:"Invalid token"})
      })
}