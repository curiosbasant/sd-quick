import { readFile, writeFile } from 'fs/promises'

async function replaceInFile(filePath, find, replace) {
  const content = await readFile(filePath, 'utf8')
  const newContent = content.replaceAll(find, replace)
  if (newContent !== content) {
    await writeFile(filePath, newContent)
  }
}

// a hack to replace the links to point in the client directory instead
replaceInFile('dist/server/index.html', /(href|src)="\//g, '$1="/client/').then(() =>
  console.log('Successfully made necessary hacks to make the extension work!')
)
