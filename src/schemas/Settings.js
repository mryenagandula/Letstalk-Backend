const mongoose = require('mongoose');

const settingsSchema = mongoose.Schema({
    theme :{
        type:'boolean',
        default:false
    },
    userId:{
		type: mongoose.Schema.Types.ObjectId,
		ref :'User'
	},
    emailSubscriptions:{
        type:'boolean',
        default:false
    },
    notifications:{
        type:'boolean',
        default:true
    }
},{ timestamps: true }
)

mongoose.model('Settings',settingsSchema);