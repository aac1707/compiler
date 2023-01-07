const express = require("express");
const path = require('path');
const { genFile } = require("./genFile");
const { execCpp }= require("./execFile");
const { createjob }= require('./createJob')
const { addJobToQueue } = require('./Queue');

const { RedisClient } = require('./redisAuth');

const app=express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/',(req,res)=>{
    console.log("OK2");
})

app.post('/run', async (req,res)=>{
    console.log(req.body);
    const {lang = "cpp", code , input} = req.body;
    if(code === undefined)
        return res.status(400).json({success : false , error : "Empty Code Body"});
    // create JOb id
        const jobId = createjob();
    
    //create file
        let ipath;
        if(input===undefined) ipath = undefined;
        else ipath = await genFile('in',input,jobId);
        const cpath = await genFile('cpp',code,jobId); 

    // push in cache
    RedisClient.setEx(jobId,3600,JSON.stringify({code : code ,
         input : input,
         cpath : cpath,
         ipath : ipath,
         success : "pending"}));
    // possible errors
    // there may be a problem when returning the input directory link in the long polling of fetch 
    // name of my own redis cache and bull queue may be same
    //push in queue
    addJobToQueue(jobId);
    res.status(201).json({ jobId });
})
app.get('/fetch', async (req,res)=>{
    const id = req.body.jobId;
    const body = await RedisClient.get(id,(error,reply)=>{
        if(error) 
            res.status(400).json({err});
    })
    res.status(200).json(JSON.parse(body));
})
app.listen(5000,()=>{
    console.log("OK1");
})

