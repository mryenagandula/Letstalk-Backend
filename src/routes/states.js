const express = require('express');
const requireAuth = require('../middlewares/requireauth.js');
const mongoose = require('mongoose');
const States = mongoose.model('States');
const Country = mongoose.model('Country');


const router = express.Router();

router.use(requireAuth)

router.get('/states', async (req, res) => {
    try {
        const states = await States.find();
        res.status(201).send({states,totalCount:states.length});
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message
        })
    }
})

router.get('/states/:id', async (req, res) => {
    try {
        const states = await States.find({countryId:req.params.id});
        res.status(201).send({states,totalCount:states.length});
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message
        })
    }
})


router.post('/states' , async (req, res) => {
    const { country,states} = req.body;
    const logs=[]
    if(!country){
        res.status(402).send({"message":"country not found"});
    }
    if(states && states.length ===0){
        res.status(402).send({"message":"states length should not be 0"}); 
    }
    try {
        const countryData = await Country.findOne({country});
        const countryD = await Country.findById(countryData._id);
        if(states.length>0){
            for (let index = 0; index < states.length; index++) {
                const state = states[index];
                state['state'] =state.name;
                delete state['name'];
                delete state['id'];
                state["countryId"]= countryData?._id || null;
                state["districts"]=[]
                const stateData = new States({...state})
                try {
                    const stateDetails =await stateData.save();
                    countryD.states = [...countryD.states,stateDetails?._id]
                    await countryD.save();
                    logs.push(`${countryD.country} - ${stateDetails.state} Added to DB Successfully `)
                } catch (error) {
                    console.log(error.message)
                    logs.push(`${countryData.country} - ${state.state} Not added to DB `)
                    continue;
                }
            }
        }
        
    } catch (error) {
        logs.push(error.message)
    }
    res.status(200).send({ logs });
});


module.exports = router;