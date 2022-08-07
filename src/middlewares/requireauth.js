const jwt = require('jsonwebtoken');

const mongoose= require('mongoose');

const User = mongoose.model('User');

module.exports=(req,res, next)=>{
	const {authorization} = req.headers;
	if(req.originalUrl.includes('/public/') || req.originalUrl.includes('/welcome') || req.originalUrl.length===0 || req.originalUrl.length===1){
		next();
		return;
	}

	if(!authorization){
		return res.status(403).send({"message":"Token is required"});
	}

	const token = authorization.replace("Bearer ",'');
	const jwtSecretKey = process.env.JWT_SECRET_KEY || "MY_SECRET_KEY_koseksi_pachipulusula";
	jwt.verify(token,jwtSecretKey,async (err,payload) => {
		if(err){
			return res.status(401).send({"message":"Please login!"});
		}
		const {user_id} = payload;
		const user =  await User.findById(user_id);
		req.user= user; 
		next();
	});
	

}