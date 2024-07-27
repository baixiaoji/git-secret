import * as fs from "fs";
import zlib from 'zlib';
import crypto from 'crypto';

const args = process.argv.slice(2);

const [option, hashArg] = args;


function checkFileExistsSync(filePath) {
    try {
      fs.accessSync(filePath, fs.constants.F_OK);
      return true;
    } catch (error) {
      return false;
    }
  }


function hashObject() {
  const filename = option.startsWith("-") ? hashArg : option;

  if (!checkFileExistsSync(filename)) {
    console.log(`${filename} does not exist.`);
    return
  }

  try {
    const content = fs.readFileSync(filename)

    const header = Buffer.from(`blob ${content.length}\0`)

    const saveContent = Buffer.concat([header, content])

    const hash = crypto.createHash("sha1").update(saveContent).digest("hex");
    
    process.stdout.write(hash);


    if (option.startsWith("-")) {
        switch(option) {
            case '-w':
                const dir = hash.substring(0, 2);
                const filename = hash.substring(2);
                const compressedBuffer = zlib.deflateSync(saveContent);
                fs.mkdirSync(`.git/objects/${dir}`, { recursive: true });
                fs.writeFileSync(`.git/objects/${dir}/${filename}`, compressedBuffer);
                break;
            default: 
                console.error("Invalid option");
        }
    }
  } catch(error) {
    console.error("An error occurred:", error.message);
  }
}

hashObject();




