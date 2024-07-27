import * as fs from "fs";
import zlib from "zlib";

const args = process.argv.slice(2);

const [option, hashArg] = args;

function getBlobContent(hash) {
  const dir = hash.substring(0, 2);
  const filename = hash.substring(2);
  const blob = fs.readFileSync(`.git/objects/${dir}/${filename}`);
  return zlib.unzipSync(blob);
}

function getFormatContent(hash) {
  const decompressedBuffer = getBlobContent(hash);
  const nullByteIndex = decompressedBuffer.indexOf(0);

  const fileContent = decompressedBuffer.subarray(nullByteIndex + 1).toString();
  const fileHeader = decompressedBuffer.subarray(0, nullByteIndex).toString();

  const [contentType, size] = fileHeader.split(" ");

  return {
    type: contentType,
    size: size,
    content: fileContent,
  };
}

function catFile() {
  const hash = option.startsWith("-") ? hashArg : option;

  if (!hash || hash.length !== 40) {
    console.error("Invalid or missing hash.");
    return;
  }

  try {
    const content = getFormatContent(hash);

    switch (option) {
      case "-t":
        console.log(content.type);
        break;
      case "-p":
        console.log(content.content);
        break;
      case "-s":
        console.log(content.size);
        break;
      default:
        console.error("Invalid option");
    }
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
}

catFile();
