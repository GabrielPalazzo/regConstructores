import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import _ from 'lodash'

//const BLACK_LIST = ['20367628376']


export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
 //console.log('entro')
 const authHeader = req.headers['authorization'] ? req.headers['authorization']  : 'Bearer ' + req.query.token
 
 
 const token = authHeader && authHeader.split(' ')[1] 



 if (!token) return res.status(401).send('Acceso denegado. Debe proveer un token') // if there isn't any token
 jwt.verify(token, process.env.SESSION_SECRET as string, (err: any, user: any) => {
   if (err) return res.status(403).send('Acceso denegado. Su token no es valido');
   req.user = user
    
  //if (!_.isEmpty(BLACK_LIST.filter(t =>  jwt.decode(token).cuit === t)))
  //  return res.status(403).send('Acceso denegado. Su token no se encuentra habilitado para realizar esta operación');

   next() 
 }) 
};

export const signToken = (userData) => {
  return jwt.sign(userData,process.env.SESSION_SECRET)
}