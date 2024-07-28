import * as fs from "fs";
import zlib from 'zlib';
import crypto from 'crypto';

export function checkFileExistsSync(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
}

export function _hashObject(filename) {
  if (!checkFileExistsSync(filename)) {
    console.log(`${filename} does not exist.`);
    return;
  }

  const content = fs.readFileSync(filename);

  const header = Buffer.from(`blob ${content.length}\0`);

  const saveContent = Buffer.concat([header, content]);

  const hash = _genHexHash(saveContent);

  return { hash, content };
}

export function _genHexHash(content) {
  return crypto.createHash("sha1").update(content).digest("hex");
}

export function _writeObject(hash, content) {
  const dir = hash.substring(0, 2);
  const filename = hash.substring(2);
  const compressedBuffer = zlib.deflateSync(content);
  fs.mkdirSync(`.git/objects/${dir}`, { recursive: true });
  fs.writeFileSync(`.git/objects/${dir}/${filename}`, compressedBuffer);
}
