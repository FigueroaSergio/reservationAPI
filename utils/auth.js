const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const UserModel = require("../models/user");
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
// Se invoca en cada request para verificar el usuario
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await UserModel.create({ email, password });

        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);
passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    function (email, password, done) {
      UserModel.findOne({ email: email }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {
            message: " Email no existente",
          });
        }
        if (!user.isValidPassword(password)) {
          return done(null, false, {
            message: "password Incorrects",
          });
        }

        return done(null, user);
      });
    }
  )
);
passport.use(
  "jwt",
  new JWTstrategy(
    {
      secretOrKey: process.env.SECRET_JWT,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    (token, done) => {
      try {
        return done(null, token);
      } catch (error) {
        done(error);
      }
    }
  )
);
exports.verifyUser = passport.authenticate("jwt", { session: false });
