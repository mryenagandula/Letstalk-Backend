const mongoose = require('mongoose');

const CountrySchema = mongoose.Schema({
    countryCode :{
        type:String,
        length:10,
        required:true,
    },
    country:{
        type:String,
        length:20,
        required:true,
    },
    isoCodes:{
        type:String,
        length:20
    },
    population:{
        type:String,
        length:20
    },
    area:{
        type:String,
        length:20
    },
    gdpUsd:{
        type:String,
        length:20
    },
    states: [
		{
		  type: mongoose.Schema.Types.ObjectId,
		  ref: "States"
		}
	],
},{ timestamps: true }
)

mongoose.model('Country',CountrySchema);