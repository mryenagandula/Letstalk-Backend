const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    title :{
        type:String,
        required: true
    },
    description:{
        type:String,
        required:true
    },
    featureImageUri:{
        type:String,
        default:null
    },
    userId:{
		type: mongoose.Schema.Types.ObjectId,
		ref :'User'
	},
    comments:[{
		type: mongoose.Schema.Types.ObjectId,
		ref :'Comment'
	}],
    categories:[{
		type: mongoose.Schema.Types.ObjectId,
		ref :'Category'
	}],
    tags:[{
		type: mongoose.Schema.Types.ObjectId,
		ref :'Tags'
	}],
    published:{
        type:'boolean',
		default:false  
    }
},{ timestamps: true }
)

mongoose.model('Blog',blogSchema);