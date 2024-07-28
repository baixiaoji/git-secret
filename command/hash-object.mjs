import { _genHexHash, _hashObject, _writeObject } from './utils.mjs'

const args = process.argv.slice(2);

const [option, hashArg] = args;



function hashObject() {
  const filename = option.startsWith("-") ? hashArg : option;

  const fileItem = _hashObject(filename)

  if (!fileItem) {
    return
  }

  try {
    process.stdout.write(fileItem.hash);
    if (option.startsWith("-")) {
        switch(option) {
            case '-w':
                _writeObject(fileItem.hash, fileItem.content)
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