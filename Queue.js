const queue =  require('bull');

const JobQ = new queue('job-queue');
const { execCpp } =  require('./execFile');
const { RedisClient } = require('./redisAuth');

const NUM_OF_WORKERS = 4;

JobQ.process(NUM_OF_WORKERS,async ({data})=>{
    const jobId = data.id;
    const job = JSON.parse(
       await RedisClient.get(jobId,(error,content)=>{
        if(error) 
            throw Error(`${jobId} does not exist`)
       })
    )
    if(job === undefined){
        throw Error(`cannot find Job with id ${jobId}`);
    }
    try{
        const output = await execCpp(job.cpath,job.ipath);
        job.output = output;
        job.success = true;
        RedisClient.setEx(jobId,3600,JSON.stringify(job));
    }catch(err){
        job.output = JSON.stringify(err);
        job.success = "error";
        RedisClient.setEx(jobId,3600,JSON.stringify(job));
    }
});

JobQ.on("failed", (error) => {
    console.error(error.data.id, "reason being ",error.failedReason);
});
const addJobToQueue = async (jobId) => {
    JobQ.add({
      id: jobId
    });
}
module.exports = {
    addJobToQueue
};
