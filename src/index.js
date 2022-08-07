require('./schemas/User.js');
require('./schemas/Track.js');
require('./schemas/Blog.js');
require('./schemas/Role.js');
require('./schemas/Audit.js');
require('./schemas/Contries.js');
require('./schemas/States.js');
require('./schemas/Cities.js');



const port = process.env.PORT || 3000;

const express =require('express');

const cors = require('cors');

const bodyParser = require('body-parser');

const blogRoute = require('./routes/blog.js');

const authRoute =require('./routes/auth.js');

const trackRoute = require('./routes/track.js');

const roleRoute = require('./routes/role');

const publicRoute = require('./routes/public');

const auditRoute = require('./routes/audit');

const contryRoute = require('./routes/contries');

const stateRoute = require('./routes/states');

const path = require('path')


const mongoose = require('mongoose');

const app = express();

app.use(cors()); //enabling for all origins
// const corsString = process.env.CORS_ORIGINS || 'http://localhost:4200';
// const whitelist  = corsString.split(',');
// const corsOptions = {
//   origin: (origin, callback) => {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error())
//     }
//   }
// }

// app.use(cors(corsOptions));


app.use(bodyParser.json());

app.use(authRoute);

app.use(trackRoute);

app.use(roleRoute);

app.use(blogRoute);


app.use(publicRoute);

app.use(auditRoute);

app.use(contryRoute);

app.use(stateRoute);

const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/nodedb5"

mongoose.connect(mongoUri, {
	useNewUrlParser:true,
	useCreateIndex:true,
	useUnifiedTopology:true,
	maxPoolSize:50,
	minPoolSize:10,
	keepAlive:true,
	keepAliveInitialDelay:30000
});

mongoose.connection.on('connected' , ()=>{
	console.log('mongodb connection established');
});

mongoose.connection.on('error',(err)=>{
	console.error('mongodb connection not established' +err);
});

app.get('/welcome',(req,res)=>{
	res.sendFile(path.join(__dirname+'/index.html'))
});

app.listen(port,()=>{
	console.log('App listening on port ',port);
})