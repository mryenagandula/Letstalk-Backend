const mongoose = require('mongoose');


//creating pointSchema
const pointSchema = new mongoose.Schema({
	timestamp : Number,
	coords: {
		latitude : Number,
		langitude : Number,
		altitude : Number,
		accuracy : Number,
		heading : Number,
		speed : Number,
	}
});


//creating trackSchema and linked with userId
const trackSchema =new mongoose.Schema({
	userId:{
		type: mongoose.Schema.Types.ObjectId,
		ref :'User'
	},
	name : {
		type: String,
		default: 'Untitled Track',
	},
	locations: [pointSchema]
});

//adding schema to mongoose
mongoose.model('Track', trackSchema);