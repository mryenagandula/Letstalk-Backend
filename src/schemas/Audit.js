//import mongoose
const mongoose = require('mongoose');

const ipInfo =new mongoose.Schema({
    ip: {
        type: 'string',
        length:30,
        default:null
    },
    city: {
        type: 'string',
        length:30,
        default:null
    },
    region: {
        type: 'string',
        length:30,
        default:null
    },
    country: {
        type: 'string',
        length:30,
        default:null
    },
    loc: {
        type: 'string',
        length:30,
        default:null
    },
    org: {
        type: 'string',
        length:30,
        default:null
    },
    postal: {
        type: 'string',
        length:30,
        default:null
    },
    timezone: {
        type: 'string',
        length:30,
        default:null
    },
    readme:{
        type: 'string',
        length:30,
        default:null
    }
})

//creating user Model
const auditSchema = new mongoose.Schema({
    uri:{
        type: 'string',
		length:20
    },
    serverIp:{
        type: 'string',
		length:20
    },
    clientIp:{
        type: 'string',
		length:20
    },
    statusCode:{
        type: 'string',
		length:20
    },
    statusMessage:{
        type: 'string',
		length:100
    },
    hostname:{
        type: 'string',
		length:30
    },
	email: {
		type: 'string',
		length:20
	},
    serverIpDetails:[ipInfo],
    clientIpDetails:[ipInfo]
}, { timestamps: true }

);


//add userSchema inside mongoose because mongoose internally connect with mongoDb
mongoose.model('Audit',auditSchema);


