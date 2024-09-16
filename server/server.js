
import express from 'express'
import cors from 'cors'
import http from 'http'
import config from './config/index.js'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import userAuth from './config/authpassport.js'
import passport from 'passport'
import router from './router.js'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express()

const server = http.createServer(app)

app.use(cors('*'))

app.use(bodyParser.urlencoded(
    { extended: false }
))

app.use(bodyParser.json())

app.use('/api',router)

// app.use(passport.initialize())

app.use(express.static(__dirname + '/public'));

userAuth(passport)

server.listen(config.port, (err) => {
    if (err) {
        console.log(err)
    }
    console.log(`Server at port ${config.port}`)
})



mongoose.connect(config.mongo_url).then(()=>{
    console.log('DB Connected Successfully')
}).catch((err)=>{
    console.log(err,'err')
})