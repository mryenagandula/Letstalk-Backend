const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
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
	},
    refType:{
		type:String,
        required:true
	},
    refId:{
        type:String,
        required:true
    },
},{ timestamps: true }
)

mongoose.model('Notifications',notificationSchema);