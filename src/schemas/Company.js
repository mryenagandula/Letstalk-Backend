const mongoose = require('mongoose');

const companySchema = mongoose.Schema({
    companyName:{
        type:String,
        required:true
    },
    companyAddress:{
        type:String,
        required:true
    },
    userId:{
		type: mongoose.Schema.Types.ObjectId,
		ref :'User'
	}
},{ timestamps: true }
)

mongoose.model('Company',companySchema);