const express =require('express');

const requireAuth = require('../middlewares/requireauth');
const adminAuth = require('../middlewares/adminauth');
const auditAuth = require('../middlewares/auditauth');

const mongoose = require('mongoose');

const User = mongoose.model('User');
const Role = mongoose.model('Role');

const jwt = require('jsonwebtoken');

const router = express.Router();

router.get('/users',[requireAuth,adminAuth],async(req,res)=>{
	try {
		const users = await User.find({},{password:0}).populate('roles');
		const usersData =[]
        for (let index = 0; index < users.length; index++) {
            const element = users[index];
            element["id"] = element._id;
            usersData.push(element);
        }
		res.status(200).send({users:usersData})
	} catch (error) {
		console.log(error.message);
		res.status(500).send({message:error.message});
	}
})


router.get('/users/:id',[requireAuth,adminAuth],async(req,res)=>{
	try {
		const user = await User.findById(req.params.id,{password:0}).populate('roles');
		res.status(200).json({user})
	} catch (error) {
		console.log(error.message);
		res.status(500).send({message:error.message});
	}
})

router.get('/user/profile',requireAuth,async(req,res)=>{
	try {
		const user = await User.findById(req.user._id,{password:0}).populate('roles');
		res.status(200).json({user})
	} catch (error) {
		console.log(error.message);
		res.status(500).send({message:error.message});
	}
})

router.put('/user/profile/update',requireAuth,async(req,res)=>{
	try {
		const user = await User.findById(req.user._id);
		const { firstName, middleName, secondName, mobile, gender, dob, bio } = req.body;
		user.firstName = firstName;
		user.middleName = middleName;
		user.secondName = secondName;
		user.mobile = mobile;
		user.gender = gender;
		user.dob = dob;
		user.bio = bio;
		await user.save();
		res.status(200).json({message: "user updated successfully !!!"});
	} catch (error) {
		console.log(error.message);
		res.status(500).send({message:error.message});
	}
})

router.get('/users/:pageIndex/:pageSize',[requireAuth,adminAuth],async(req,res)=>{
	try {
		const {pageIndex,pageSize}= req.params;
		const allUsers = await User.find();
		const users = await User.find({},{password:0}).populate('roles').limit(parseInt(pageSize)).skip(parseInt(pageSize)*parseInt(pageIndex));
		res.status(200).json({users, totalCount: allUsers.length})
	} catch (error) {
		console.log(error.message);
		res.status(500).send({message:error.message});
	}
})

router.post('/signup',async(req,res)=>{
	try{
		if(req.body?.roles){
			const roles = await Role.find({title : {$in: req.body.roles}});
			const roleIds = roles.map(role=>role._id);
			req.body.roles = roleIds;
		}
		else{
			const role = await Role.findOne({title : 'USER'});
			req.body.roles = [role._id];
		}
		const user = new User(req.body);
		await user.save();
		res.send({"message":"user created successfully"});	
	}
	catch(err){
		console.log(err);
		res.status(422).send({"message": err.message,"errcode":err.code});
	}
	
})


router.post('/signin',[auditAuth], async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(402).send({ "message": "email and password required" });
	}

	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(402).send({ "message": "User not found with the mentioned email id" });
		}
		await user.comparePassword(password);
		const jwtSecretKey = process.env.JWT_SECRET_KEY || "MY_SECRET_KEY_koseksi_pachipulusula";
		const jwtTokenExpireTime = Number(process.env.JWT_TOKEN_EXPIRATION_TIME) || 86400
		const token = jwt.sign(
			{ "user_id": user._id, "email_id": user.email, "username": user.username },
			jwtSecretKey,
			{
				expiresIn: jwtTokenExpireTime
			}
		);
		const userDetails= await User.findOne({ _id:user._id },{password:0}).populate("roles");
		res.send({ token, user: userDetails });
	}
	catch (err) {
		return res.status(402).send({ "message": "error with the email and password" })
	}
})



//added to exports module
module.exports =router;