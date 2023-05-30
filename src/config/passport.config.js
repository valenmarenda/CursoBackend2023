import passport from 'passport';
import local from 'passport-local';
import userService from '../Dao/models/users.js';
import { createHash, validatePassword } from '../utils.js';
import GitHubStrategy from 'passport-github2';

const LocalStrategy = local.Strategy;

const initializePassport = () => {

    passport.use('register', new LocalStrategy(
        {passReqToCallback:true, usernameField:'email'}, 
        async (req,username, password,done) =>{
            const { first_name, last_name, email,age } = req.body;
            const rol = "user"
            try {
                const user = await userService.findOne({email:username}); 
                if(user){
                    console.log('The user exists');
                    return done(null,false);
                }
                const newUser = {
                    first_name, 
                    last_name, 
                    email, 
                    age, 
                    password: createHash(password),
                    rol
                }

                const result = await userService.create(newUser);
                return done(null, result);

            } catch (error) {
                return done("Failed to register user: " + error);
            }
        }
    ));

    passport.use('login', new LocalStrategy({usernameField:'email'}, async (username, password, done)=>{

        try {
           
           const user = await userService.findOne({email:username})
           //console.log(user);
            if(!user){
                console.log('No existe el usuario');
                return done(null, false);
            }
            if(!validatePassword(password,user)) return done (null, false);
            return done(null,user);

        } catch (error) {
            
            return done("Error trying to log in: " + error);
            
        }

    }))

    passport.use('github', new GitHubStrategy({
        clientID:'Iv1.5ce2f5bc4e7e7a56',
        clientSecret:'eaa0ca5a9148cd31ac8930122feee432d77b1dd1',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'

    }, async (accesToken, refreshToken,profile,done)=>{
        try {
            
            console.log(profile); 
            let user = await userService.findOne({email: profile._json.email})
            if(!user){

                const email = profile._json.email == null ?  profile._json.username : null;

                const newUser = {
                        first_name: profile._json.name,
                        last_name:'',
                        email: email,
                        age: 18,
                        password: '',
                }
                const result = await userService.create(newUser);
                done(null,result)
            }else{
           
                done(null, user)
            }

        } catch (error) {
            return done(null,error)
        }
    }))
    passport.serializeUser((user,done)=>{
        done(null, user._id)
    });
    passport.deserializeUser( async (id, done)=>{
        const user = await userService.findById(id);
        done(null, user)
    });

}

export default initializePassport;