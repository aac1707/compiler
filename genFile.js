const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

const Dire = path.join(__dirname, "workspace");
if (!fs.existsSync(Dire)) {
    fs.mkdirSync(Dire, { recursive: true });
}

const genFile = async (format,content,fileid)=>{
    const filename = `${fileid}.${format}`;
    const filepath = path.join(Dire, filename);
    await fs.writeFileSync(filepath, content);
    return filepath;
}
module.exports = {
    genFile
};