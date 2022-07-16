//import mongoose
const mongoose = require('mongoose');

//import bcrypt
const bcrypt = require('bcrypt');

//creating user Model
const userSchema = new mongoose.Schema({
	userName:{
		type: 'string',
		unique: true,
		length:12,
		required: true	
	},
	firstName:{
		type: 'string',
		length:20,
		required: true	
	},
	middleName:{
		type: 'string',
		required: false,
		length:20,
		default:null
	},
	secondName:{
		type: 'string',
		length:20,
		required: true	
	},
	mobile:{
		type: 'string',
		unique: true,
		required: true	
	},
	gender:{
		type: 'string',
		enum: ["Male", "Female","Others"],
		required: true	
	},
	dob:{
		type: 'string',
		required: true	
	},
	email: {
		type: 'string',
		unique: true,
		length:20,
		required: true
	},
	password: {
		type: 'string',
		length:16,
		required:true,
		
	},
	email_Verified:{
		type:'boolean',
		default:false
	},
	activated:{
		type:'boolean',
		default:false
	},
	bio:{
		type:'string',
		length:100,
		default:null
	},
	roles: [
		{
		  type: mongoose.Schema.Types.ObjectId,
		  ref: "Role"
		}
	],
	hobbies:[String]
}, { timestamps: true }

);


//creating pre save hook in userschema
userSchema.pre('save',function(next){
	//will get user obj
	const user = this;
	//checking user password is modified
	if(!user.isModified('password')){
		return next();
	}

	bcrypt.genSalt(10,(err,salt)=>{
		if(err){
			return next(err);
		}
		//creating Hash bcrypt with salt 
		bcrypt.hash(user.password,salt,(err,hash)=>{
			if(err){
				return next(err);
			}
			user.password = hash;//change userdefined password to hash
			next();// to process save function;
		})
	})

})

//creating comparePassword method in userSchema
userSchema.methods.comparePassword = function(candidatePassword){
	const user=this;
	//creating Promise for checking user password
	return new Promise((resolve,reject)=>{
		bcrypt.compare(candidatePassword,user.password,(err,isMatch)=>{
			if(err){
				return reject(err);
			}
			if(!isMatch){
				return reject(false);
			}
			resolve(true);
		});
	})
}


//add userSchema inside mongoose because mongoose internally connect with mongoDb
mongoose.model('User',userSchema);


