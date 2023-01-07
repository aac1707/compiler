const { v4: uuid } = require("uuid");

const createjob = ()=>{
    const jobId = uuid()
    return jobId;
}
module.exports= {
    createjob
};