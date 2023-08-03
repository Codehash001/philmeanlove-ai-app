// In your Next.js API route (e.g., api/read-pdf/[filename].ts)
import { NextApiHandler } from 'next';
import fs from 'fs';
import path from 'path';

const handler: NextApiHandler = (req, res) => {
  const filename = req.query.filename as string;
  const filePath = path.join(process.cwd(), '../public/docs', filename);

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    res.status(404).send('File not found');
    return;
  }

  // Read the file and send it as response
  const fileStream = fs.createReadStream(filePath);
  res.setHeader('Content-Type', 'application/pdf');
  fileStream.pipe(res);
};

export default handler;
