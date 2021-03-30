var passport = require('passport'),
  TwitterStrategy = require('passport-twitter').Strategy

var verifyHandler = function (accessToken, refreshToken, profile, done) {
  process.nextTick(function () {
    return done(null, profile)
  });
};

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_KEY,
  consumerSecret: process.env.TWITTER_SECRET,
  callbackURL: `${process.env.API_URL}/v1/auth/twitter/callback`
}, verifyHandler));
