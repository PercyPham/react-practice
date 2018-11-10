import passport from "passport";
import { OAuth2Strategy as Strategy } from "passport-google-oauth";
import to from "await-to-js";

import User from "./models/User";

function auth({ ROOT_URL, server }) {
  const verify = async (accessToken, refreshToken, profile, verified) => {
    let email;
    let avatarUrl;

    if (profile.emails) {
      email = profile.emails[0].value;
    }

    if (profile.photos && profile.photos.length > 0) {
      avatarUrl = profile.photos[0].value.replace("sz=50", "sz=128");
    }

    const [err, user] = await to(
      User.signInOrSignUp({
        googleId: profile.id,
        email,
        googleToken: { accessToken, refreshToken },
        displayName: profile.displayName,
        avatarUrl
      })
    );
    if (err) console.log(err);
    verified(err, user);
  };

  passport.use(
    new Strategy(
      {
        clientID: process.env.Google_clientID,
        clientSecret: process.env.Google_clientSecret,
        callbackURL: `${ROOT_URL}/auth/google/callback`
      },
      verify
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, User.publicFields(), (err, user) => {
      done(err, user);
    });
  });

  server.use(passport.initialize());
  server.use(passport.session());

  server.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
      prompt: "select_account"
    })
  );

  server.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (_, res) => {
      res.redirect("/");
    }
  );

  server.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/login");
  });
}

export default auth;
