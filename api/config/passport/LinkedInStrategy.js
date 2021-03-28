var passport = require('passport'),
  LinkedInStrategy = require('passport-linkedin-oauth2').Strategy

var verifyHandler = function (accessToken, refreshToken, profile, done) {
  process.nextTick(function () {
    return done(null, profile)
  });
};

passport.use(new LinkedInStrategy({
  clientID: process.env.LINKEDIN_KEY,
  clientSecret: process.env.LINKEDIN_SECRET,
  callbackURL: `${process.env.API_URL}/v1/auth/linkedin/callback`,
  scope: ['r_emailaddress', 'r_liteprofile'],
  state: true
}, verifyHandler));
