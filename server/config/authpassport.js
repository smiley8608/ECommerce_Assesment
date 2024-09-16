
import passport from 'passport';
import { Usermodal } from '../models/index.js';
import config from './index.js'

import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.SECRETKEY;

const userAuth = ()=>{
    try {
      
        passport.use(
            'userAuth',
            new JwtStrategy(opts,async function(jwt_payload, done) {
           
         const user=  await Usermodal.findOne({_id: jwt_payload.id}).lean()
        
            if(user){   

                const payload ={
                    _id:  user._id,
                    isSuperAdmin:false             
                }

                done(null,payload)
            }else{

                
              if(jwt_payload.id==  config.DEFAULTADMIN_ID){
                let payload={
                    _id:config.DEFAULTADMIN_ID,
                    isSuperAdmin:true,
                }

                done(null,payload)
              } else{
                 done(null, false);
              } 
            }
        }));
    } catch (error) {
            
            return done(error, false);
         
    }
   
      
   
}


export default userAuth


