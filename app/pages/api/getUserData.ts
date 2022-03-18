import axios from 'axios'

export default (req, res) => {
  res.statusCode = 200
  axios.get(process.env.OPENID_USERDATA,{
        headers: {
          "authorization":`Bearer ${req.body.access_token}`
        }
      }).then(result => {
        res.json(result.data)
      })
}