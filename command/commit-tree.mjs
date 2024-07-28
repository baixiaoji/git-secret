import { _genHexHash, _writeObject } from './utils.mjs'

const args = process.argv.slice(2);

const [treeSha, ...resetArgs] = args

function CommitTree() {
  let hash = ''
  if (args.length === 3) {
    hash = _commitObject({
        treeOid: treeSha,
        message: resetArgs[1],
    })
  } else {
    hash = _commitObject({
        treeOid: treeSha,
        parentCommit: resetArgs[1],
        message: resetArgs[3],
    })
  }
  return hash
}

function _commitObject({
    treeOid,
    message,
    parentCommit
}) {

    const content = Buffer.concat([
        Buffer.from(`tree ${treeOid}\n`),
        parentCommit ? Buffer.from(`parent ${parentCommit}\n`) : Buffer.alloc(0),
        Buffer.from(`author baixiaoji <baixiaoji@foxmail.com> ${Date.now()} +0800\n`),
        Buffer.from(`committer baixiaoji <baixiaoji@foxmail.com> ${Date.now()} +0800\n`),
        Buffer.from(`\n${message}\n`)
    ])

    const header = Buffer.from(`commit ${content.length}\0`)

    const saveContent = Buffer.concat([header, content])

    const hash = _genHexHash(saveContent)

    _writeObject(hash, saveContent)

    return hash
}






console.log(CommitTree())