const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
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

mongoose.model('Category',categorySchema);