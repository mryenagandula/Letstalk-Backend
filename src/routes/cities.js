const express = require('express');
const requireAuth = require('../middlewares/requireauth.js');
const mongoose = require('mongoose');
const Cities = mongoose.model('cities');


const router = express.Router();

router.use(requireAuth)

router.get('/cities', async (req, res) => {
    try {
        const cities = await Cities.find();
        res.status(201).send({cities,totalCount:cities.length});
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message
        })
    }
})

router.get('/cities/:name', async (req, res) => {
    try {
        const cities = await Cities.find({state_name:req.params.name});
        res.status(201).send({cities,totalCount:cities.length});
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message
        })
    }
})



module.exports = router;