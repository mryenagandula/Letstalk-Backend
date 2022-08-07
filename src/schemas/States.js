const mongoose = require('mongoose');
const StatesSchema = mongoose.Schema({
    state:{
      type:String,
      length:10,
      required:true
    },
    stateCode :{
        type:String,
        length:10,
        required: true,
    },
    latitude:{
        type:String,
        length:20,
    },
    longitude:{
      type:String,
      length:20,
    },
    countryId:{
      type: mongoose.Schema.Types.ObjectId,
      ref :'Country'
    },
    districts: [
		{
		  type: mongoose.Schema.Types.ObjectId,
		  ref: "Districts"
		}
	],
},{ timestamps: true }
)

mongoose.model('States',StatesSchema);