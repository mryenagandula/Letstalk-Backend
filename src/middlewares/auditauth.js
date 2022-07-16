const mongoose= require('mongoose');
const axios= require('axios');
const Audit = mongoose.model('Audit');

module.exports= (req,res, next)=>{
     const {email} = req.body
     const originalUrl = req.originalUrl
     let statusCode = 0 ;
     let statusMessage = '';
     const privateIp = req.ip.split(':').slice(-1)[0] || req.connection.remoteAddress.split(':').slice(-1)[0] || req.socket.remoteAddress.split(':').slice(-1)[0]
     const publicIp = req.headers['x-forwarded-for'];
     const hostname = req.hostname;

     res.on('finish',async ()=>{
          statusCode=res.statusCode;
          statusMessage=res.statusMessage;
          if(hostname !=='localhost'){
               try {
                    const clientIpDetails =  await axios.get(`https://ipinfo.io/${publicIp}`);
                    const serverIpDetails =  await axios.get(`https://ipinfo.io`);
                    const audit = new Audit({
                         uri: originalUrl,
                         serverIp: privateIp,
                         clientIp: publicIp,
                         statusCode,
                         statusMessage,
                         hostname,
                         email,
                         serverIpDetails:[serverIpDetails.data],
                         clientIpDetails:[clientIpDetails.data]
                    });
                    const auditDetails = await audit.save();
                    console.log('Audit created successfully '+auditDetails._id +" "+  Date.now() )
               } catch (error) {
                    console.log(error.message)
               }
          }
     })

     next();
}