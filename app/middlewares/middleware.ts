import nextConnect from 'next-connect';
import database from './database';
import session from './session';
import { checkJwt } from "./checkJwt";

const middleware = nextConnect();

middleware.use(database).use(session).use(checkJwt); //.use(passport.authenticate('jwt', {session: false}));//.use(passport.session());

export default middleware;
