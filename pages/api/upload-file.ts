import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import { join } from 'path';
import FormData from 'form-data';

const uploadFile = (fileData: Buffer, filePath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const absoluteFilePath = join(process.cwd(), filePath);

    fs.writeFile(absoluteFilePath, fileData, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

export default async function uploadFileHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).end(); // Method Not Allowed
    return;
  }

  try {
    const { fileData, filePath } = req.body;

    if (!fileData || !filePath) {
      res.status(400).json({ error: 'Invalid file data or file path' });
      return;
    }

    const fileBuffer = Buffer.from(fileData, 'base64');

    const formData = new FormData();
    formData.append('file', fileBuffer, { filename: filePath });

    try {
      // Perform necessary steps to upload the file using the FormData
      // e.g., send a request to an external API endpoint
      // or save the file to the server using fs.writeFile
      // Replace the code below with your desired implementation

      // Example: Saving the file using fs.writeFile
      await uploadFile(fileBuffer, filePath);

      res.status(200).end(); // Success
    } catch (error) {
      console.error('Error uploading file to the server:', error);
      res.status(500).json({ error: 'Failed to upload the file' });
    }
  } catch (error) {
    console.error('Error processing file upload:', error);
    res.status(500).json({ error: 'Failed to process the file upload' });
  }
}
