import multiparty from 'multiparty';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import fs from 'fs';
import mime from 'mime-types';
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";
const bucketName = 'kosh-admin';

export default async function handle(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    await mongooseConnect();
    await isAdminRequest(req, res);

    const form = new multiparty.Form();
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    const client = new S3Client({
      region: 'sa-east-1',
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
    });

    const uploadPromises = files.file.map(async file => {
      const ext = file.originalFilename.split('.').pop();
      const newFileName = `${Date.now()}.${ext}`;
      await client.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: newFileName,
        Body: fs.createReadStream(file.path),
        ACL: 'public-read',
        ContentType: mime.lookup(file.path),
      }));
      fs.unlinkSync(file.path); // Eliminar el archivo temporal
      return `https://${bucketName}.s3.amazonaws.com/${newFileName}`;
    });

    const links = await Promise.all(uploadPromises);
    res.json({ links });

  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export const config = {
  api: { bodyParser: false },
};
