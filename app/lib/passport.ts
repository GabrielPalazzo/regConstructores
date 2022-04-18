import passport from 'passport';
import bcrypt from 'bcryptjs';
// import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

passport.serializeUser((user, done) => {
  //done(null, user._id);
  done(null, user);
});

// passport#160
passport.deserializeUser((user, done) => {
  /*
  req.db
    .collection('users')
    .findOne({ _id: id })
    .then((user) => done(null, user));
    */
    done(null, user);
});

/*
passport.use(
  new LocalStrategy(
    { usernameField: 'email', passReqToCallback: true },
    async (req, email, password, done) => {
      const user = await req.db.collection('users').findOne({ email });
      if (user && (await bcrypt.compare(password, user.password))) done(null, user);
      else done(null, false, { message: 'Email or password is incorrect' });
    },
  ),
);
*/

// jwt
let opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  secretOrKey: "your-256-bit-secret"
};

passport.use(new JwtStrategy(opts, (jwt_payload, done) => {

  return done(null, jwt_payload.user);
}));

export default passport;
