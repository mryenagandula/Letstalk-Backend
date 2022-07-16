const mongoose = require('mongoose');

const tagSchema = mongoose.Schema({
    title :{
        type:String,
        required: true
    },
    description:{
        type:String,
        required:true
    },
    userId:{
		type: mongoose.Schema.Types.ObjectId,
		ref :'User'
	}
},{ timestamps: true }
)

mongoose.model('tag',tagSchema);