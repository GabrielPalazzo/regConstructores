

(async () =>{
  const fs = require('fs')

  const DATA = `
  import { RootAPI } from './root'
import { AbortOptions, Await, AwaitIterable } from './basic'

export type {
  RootAPI,

  AbortOptions,
  Await,
  AwaitIterable
}`

  fs.writeFile('./node_modules/ipfs-core-types/src/index.ts',DATA,(err) =>{

  })
})()