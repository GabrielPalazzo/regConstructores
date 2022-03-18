import { File } from "formidable";
import Formidable from "formidable-serverless";
import fs from "fs";

import nextConnect from 'next-connect';
import { nanoid } from 'nanoid';
import middleware from '../../../middlewares/middleware';
import { NextApiResponse } from 'next';

/* Client example
curl --request POST \
  --url http://localhost:3000/api/document \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.ZGhf3Ckx2Ia3toSmtzsH9DVj9TcXZ-laJ9pimxXe0_k' \
  --header 'Content-Type: multipart/form-data' \
  --header 'content-type: multipart/form-data; boundary=---011000010111000001101001' \
  --form files=
*/

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req: any, res: NextApiResponse) => {
  const {
    query: { idTramite },
  } = req

  let fileData: File;
  if (!req.user) {
    return res.status(401).send('unauthenticated');
  }
  
  const form = new Formidable.IncomingForm({
    multiples: true,
    keepExtensions: true,
  });

  form
    .on("file", (name: string, file: File) => {
      const data = fs.readFileSync(file.path);
      fs.writeFileSync(`public/upload/${file.name}`, data);
      fs.unlinkSync(file.path);
      fileData = file;
    })
    .on("aborted", () => {
      return(res.status(500).send('Aborted'))  
    })
    .on("end", async () => {
      const newDocument = {
        _id: nanoid(),
        file: fileData,
        tramite: { _id: idTramite },
        createdAt: new Date(),
        creatorId: req.user,
      };
    
      await req.db.collection('documents').insertOne(newDocument);
      return res.send(newDocument);   
        });

  await form.parse(req)



  });

  handler.get(async (req: any, res: NextApiResponse) => {
    const {
      query: { idTramite },
    } = req
  
  
    // Pagination: Fetch posts from before the input date or fetch from newest
    //const creatorId = req.query.by;
    const documents = await req.db
      .collection('documents')
      .find({"tramite._id": idTramite
        }
      ).toArray();
    res.send({documents});
  });  

  handler.delete(async (req: any, res: NextApiResponse) => {
    const {
      query: { id },
    } = req
  
    // Pagination: Fetch posts from before the input date or fetch from newest
    //const creatorId = req.query.by;
    await req.db
      .collection('documents')
      .remove({"_id": id}
      );
    res.send({});
  });
  
export default handler;

