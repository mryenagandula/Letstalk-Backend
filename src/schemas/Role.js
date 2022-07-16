const mongoose = require('mongoose');

const RoleSchema = mongoose.Schema({
    title :{
        type:String,
        length:16,
        required: true,
        unique:true
    },
    description:{
        type:String,
        length:50,
        required:true
    },
    userId:{
		type: mongoose.Schema.Types.ObjectId,
		ref :'User'
	}
},{ timestamps: true }
)

mongoose.model('Role',RoleSchema);