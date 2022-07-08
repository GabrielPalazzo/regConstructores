import ipfsClient from 'ipfs-http-client'
import multiparty from 'multiparty'
import fs from 'fs'
import { Agent } from 'http'


const endpoint = async (req, res) => {
  try 
  {
    const  ipfsAgent = new Agent({
      keepAlive: true,
      keepAliveMsecs: 1000,
      maxSockets: 256,
      maxFreeSockets: 256
    });

    let form = new multiparty.Form();
    const result: Array<{
      fileName: string
      cid: string
      createdAt: number
    }> = []

    form.parse(req, async (err, fields, files) => {
      if (err)
        console.log('#### Endpoint Error file new ' + err);

      const client = ipfsClient({
        host: process.env.IPFS_NODE_HOST,
        protocol: process.env.IPFS_NODE_PROTOCOL,
        port: parseInt(process.env.IPFS_NODE_PORT, 10),
        apiPath: process.env.IPFS_NODE_APIPATH,
        agent: ipfsAgent
      });

      for (let i = 0; i <= files.file.length - 1; i++)
      {
        const f = files.file[i]
        const binary = fs.readFileSync(f.path)
        const { cid } = await client.add(binary)
        result.push({
          fileName: f.originalFilename,
          cid: cid.toString(),
          createdAt: new Date().getTime()
        })
        res.json({ filesSaved: result })
      }
    });

  }
  catch (error)
  {
    console.log('#### Catch Error file new ' + error);
    res.status(500).send(error)
  }
}

export const config = { api: { bodyParser: false, }, };

export default endpoint