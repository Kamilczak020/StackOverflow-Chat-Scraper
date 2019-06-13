"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Passport = require("passport");
const LocalAPIKeyStrategy = require('passport-localapikey-update').Strategy;
// Import our authentication config file
const authConfig = require('../../configs/authconfig.json');
class Authenticate {
    constructor() {
        this.passport = new Passport.Passport();
        // Init passport with digest strategy
        this.passport.use(new LocalAPIKeyStrategy({ qop: 'auth' }, (apikey, done) => {
            if (apikey !== authConfig.apikey) {
                return done(null, false);
            }
            return done(null, apikey);
        }));
    }
}
const auth = new Authenticate();
exports.passport = auth.passport;
