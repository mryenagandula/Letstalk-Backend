const express = require('express');
const requireAuth = require('../middlewares/requireauth.js');
const mongoose = require('mongoose');
const Role = mongoose.model('Role');
const User = mongoose.model('User');
const router = express.Router();

router.use(requireAuth);

router.get('/roles/', async (req, res) => {
    try {
        const roles = await Role.find();
        res.status(201).send({roles,totalCount:roles.length});
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message
        })
    }
})

router.get('/roles/:pageIndex/:pageSize',async (req, res) => {
    try {
        const {pageIndex,pageSize}= req.params;
		const allRoles = await Role.find();
		const roles = await Role.find({}).limit(parseInt(pageSize)).skip(parseInt(pageSize)*parseInt(pageIndex));
        res.status(201).send({roles,totalCount:allRoles.length});
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message
        })
    }
})
 
router.post('/roles/' ,[requireAuth,adminAuth], async (req, res) => {
    const { description,title } = req.body;
    const role = new Role({
        description, title, userId:req.user._id
    })
    try {
        await role.save();
        res.status(201).send(role);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

router.put('/roles/assignee' , [requireAuth,adminAuth],  async (req, res) => {
    const { userId, roleId, roleTitle} = req.body;
    try {
        const user =await User.findOne({_id:userId},{password:0}).populate('roles');
        const userDetails = await User.findOne({_id:userId});
        const roles=user.roles.filter(role=> role.title === roleTitle );
        if(roles && roles.length === 0){
            const role=await Role.findOne({_id:roleId,title:roleTitle});
            const roleIds=userDetails.roles.map(role=> role._id)
            userDetails.roles=[...roleIds,role._id];
            userDetails.save();
        }
        res.status(201).send({ message: 'Role assigned to ' + userDetails.email +' successfully'});
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});


router.put('/roles/remove/assignee',[requireAuth,adminAuth], async (req, res) => {
    const { userId, roleId, roleTitle} = req.body;
    try {
        const user =await User.findOne({_id:userId},{password:0}).populate('roles');
        const userDetails = await User.findOne({_id:userId});
        const roles=user.roles.filter(role=> role.title === roleTitle );
        if(roles && roles.length !== 0){
            const roles=user.roles.filter(role=> role.title !== roleTitle );
            userDetails.roles=roles.map(role=> role._id);
            userDetails.save();
        }
        res.status(201).send({ message: 'Role removed from user ' + userDetails.email +' successfully'});
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});
module.exports = router;