import { ConsoleSqlOutlined } from '@ant-design/icons'
import ipfsClient from 'ipfs-http-client'
import fs from 'fs'
import { Agent } from 'http';

/** 
 * https://www.npmjs.com/package/ipfs-http-client/v/55.0.1-7fe0da57f.0
 * Code: agent: process.env.agent as any || new Agent({ keepAlive: true, maxSockets: 6 })
 * CONSD-114861 Análisis logs 10/01/2022 para detección y corrección de error reportado en INFRAONC-2481
 * INFRAONC-2601 Solicitud de archivos de logs de errores de RNC PRD del día 10/01/2022
*/
const endpoint = async (req, res) => {
  try {
    const { id: documentId, name } = req.query;
    const fileName = 'rnc_private_doc.pdf';
    
    const  ipfsAgent = new Agent({
      keepAlive: true,
      keepAliveMsecs: 1000,
      maxSockets: 256,
      maxFreeSockets: 256
    });

    const client = ipfsClient({
      host: process.env.IPFS_NODE_HOST,
      protocol: process.env.IPFS_NODE_PROTOCOL,
      port: parseInt(process.env.IPFS_NODE_PORT, 10),
      apiPath: process.env.IPFS_NODE_APIPATH,
      agent: ipfsAgent  
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