const express = require('express');
const requireAuth = require('../middlewares/requireauth.js');
const mongoose = require('mongoose');
const Countries = mongoose.model('Country');

const router = express.Router();

router.use(requireAuth)

router.get('/countries', async (req, res) => {
    try {
        const countries = await Countries.find().populate('states');
        res.status(201).send({countries,totalCount:countries.length});
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message
        })
    }
})


router.post('/countries' , async (req, res) => {
    const { countryCode,country,isoCodes,population,area,gdpUsd} = req.body;
    try {
        const countryData = await Countries.findOne({countryCode});
        if(!countryData){
            const contry = new Countries({
                countryCode,country,isoCodes,population,area,gdpUsd, states:[]
            })
            try {
                await contry.save();
                res.status(201).send(contry);
            } catch (error) {
                res.status(500).send({ message: error.message });
            }
        }
        else{
            res.status(402).send({message : "Record already existed"});
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});


module.exports = router;