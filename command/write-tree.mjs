import * as fs from 'fs'
import path from 'path'
import { _hashObject, _writeObject, _genHexHash } from './utils.mjs'

const args = process.argv.slice(2);

function writeTree(dir) {
   // 1. 获取目标目录所有文件或是目录信息（需剔除`.git`目录）
   const entries = fs.readdirSync(dir, { withFileTypes: true }).filter(fileItem => fileItem.name !== '.git');

  // 2. 根据文件类型进行分别生成 blob或tree对象，并记录成标准格式
   const fileList = entries.map(item => {
        const fullname = path.join(dir, item.name)
        if (item.isFile()) {
            const oid = _hashObject(fullname).hash
            return {
                mode: 100644,
                name: item.name,
                oid
            }
        } else if(item.isDirectory()) {
            const treeId = writeTree(fullname)
            return {
                mode: 40000,
                name: item.name,
                oid: treeId
            }
        }

   })

 // 组装 tree 对象存储内容格式生成 tree id, 后续写入 `.git`目录
  const buffers = fileList.map(m => Buffer.concat([
    Buffer.from(`${m.mode} ${m.name}\0`),
    Buffer.from(m.oid, "hex")  // 将 16进制转化为二进制
  ]))

  const content = Buffer.concat(buffers)
  const header = Buffer.from(`tree ${content.length}\0`)
  const tree = Buffer.concat([header, content])

  const hash = _genHexHash(tree)

  _writeObject(hash, tree)

  // 4. 返回 tree 对象 oid
  return hash
}

console.log(writeTree(args[0]))