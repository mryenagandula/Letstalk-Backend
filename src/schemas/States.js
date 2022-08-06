const mongoose = require('mongoose');

const StatesSchema = mongoose.Schema({
    statesCode :{
        type:String,
        length:10,
        required: true,
        unique:true
    },
    title:{
        type:String,
        length:20,
        required:true
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