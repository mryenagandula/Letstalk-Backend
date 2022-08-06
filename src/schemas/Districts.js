const mongoose = require('mongoose');

const DistrictsSchema = mongoose.Schema({
    districtsCode :{
        type:String,
        length:10,
        required: true,
        unique:true
    },
    title:{
        type:String,
        length:20,
        required:true
    }
},{ timestamps: true }
)

mongoose.model('Districts',DistrictsSchema);