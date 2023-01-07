const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "workspace");

const execCpp = (codeFilepath,inputFilepath = undefined)=>{
    const jobId = path.basename(codeFilepath).split(".")[0];
    const outPath = path.join(outputPath, `${jobId}.out`);
    if(inputFilepath===undefined){
    return new Promise((resolve, reject) => {
        exec(`g++ ${codeFilepath} -o ${outPath} && cd ${outputPath} && ${outPath}`,
        { timeout : 10000 },
        (error, stdout, stderr)=>{
            error && reject({ error, stderr });
            stderr && reject(stderr);
            resolve(stdout);
        })
    })
}
        return new Promise((resolve,reject)=>{
            exec(`g++ ${codeFilepath} -o ${outPath} && cd ${outputPath} && ${outPath} < ${inputFilepath}`,
            { timeout : 10000 },
            (error,stdout,stderr)=>{
                error && reject({ error, stderr });
                stderr && reject(stderr);
                resolve(stdout);
            })
        })
}
module.exports = {
    execCpp,
};