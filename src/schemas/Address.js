const mongoose = require('mongoose');

const addressSchema = mongoose.Schema({
    street:{
        type:String,
        required:true
    },
    landmark:{
        type:String,
        required:true
    },
    pincode:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    userId:{
		type: mongoose.Schema.Types.ObjectId,
		ref :'User'
	}
},{ timestamps: true }
)

mongoose.model('Company',addressSchema);