import * as Passport from 'passport';
import { DigestStrategy } from 'passport-http';
const LocalAPIKeyStrategy = require('passport-localapikey-update').Strategy;

// Import our authentication config file
const authConfig = require('../../configs/authconfig.json');

class Authenticate {
    public passport: Passport.Passport;

    constructor() {
        this.passport = new Passport.Passport();
        
        // Init passport with digest strategy
        this.passport.use(new LocalAPIKeyStrategy({qop: 'auth'}, 
            (apikey, done) => {
                if (apikey !== authConfig.apikey) {
                    return done(null, false);
                }
                return done(null, apikey);
            },
        ));
    }
}

const auth = new Authenticate();
export const passport = auth.passport;
