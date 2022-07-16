const mongoose= require('mongoose');

const User = mongoose.model('User');

module.exports= (req,res, next)=>{
     User.findById(req.user._id).populate('roles').exec((error,user)=>{
         if(error){
            res.status(403).json({message : error.message});
            return;
         }
         const roles =  user.roles.filter(role=>role.title==='USER');
         if(roles && roles.length>0){
             next();
             return;
         }
         else{
             res.status(403).json({message : 'User role required !!'});  
             return;
         }  
     })
}