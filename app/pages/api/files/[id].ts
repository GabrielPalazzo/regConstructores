import { ConsoleSqlOutlined } from '@ant-design/icons'
import ipfsClient from 'ipfs-http-client'
import fs from 'fs'



const endpoint = async (req, res) => {
  try {
    const { id: documentId, name } = req.query;
    const fileName = 'rnc_private_doc.pdf';

    // console.log(req.query.id);
    const client = ipfsClient({
      host: process.env.IPFS_NODE_HOST,
      protocol: process.env.IPFS_NODE_PROTOCOL,
      port: parseInt(process.env.IPFS_NODE_PORT, 10),
      apiPath: process.env.IPFS_NODE_APIPATH
    })

    const stream = client.cat(documentId);

    let data = [];
    for await (const chunk of stream) { data.push(chunk) }

    res.writeHead(200, {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename=${name}`,
      'Content-Length': Buffer.concat(data).length
    });
    res.end(Buffer.concat(data));

  }
  catch (error) {
    console.log('#### Error endpoint get [id] ' + req.query.id + '. ' + error);
    res.status(500).send(error)
  }
}

export const config = { api: { bodyParser: false, }, };

export default endpoint