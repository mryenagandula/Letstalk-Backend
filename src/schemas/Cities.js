const mongoose = require('mongoose');
const citiesSchema = mongoose.Schema({
    id:{
      type:String,
      length:10,
    },
    name :{
        type:String,
        length:10,
    },
    state_id:{
        type:String,
        length:20,
    },
    state_name:{
        type:String,
        length:20,
    },
    country_id:{
        type:String,
        length:20,
    },
    country_code:{
        type:String,
        length:20,
    },
    country_name:{
        type:String,
        length:20,
    },
    longitude:{
      type:String,
      length:20,
    },
    latitude:{
      type:String,
      length:20,
    },
    wikiDataId:{
      type:String,
      length:20,
    },
    stateId:{
      type: mongoose.Schema.Types.ObjectId,
      ref :'States'
    },
},{ timestamps: true }
)


mongoose.model('cities',citiesSchema);