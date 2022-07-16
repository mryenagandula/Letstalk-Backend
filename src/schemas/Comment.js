const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    text:{
        type:String,
        required:true
    },
    userId:{
		type: mongoose.Schema.Types.ObjectId,
		ref :'User'
	},
    blogId:{
		type: mongoose.Schema.Types.ObjectId,
		ref :'Blog'
	}
},{ timestamps: true }
)

mongoose.model('Comment',commentSchema);