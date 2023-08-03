import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import { join } from 'path';

const createFolder = (folderPath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const absoluteFolderPath = join(process.cwd(), folderPath);

    fs.mkdir(absoluteFolderPath, { recursive: true }, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

export default async function createFolderHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).end(); // Method Not Allowed
    return;
  }

  const { folderPath } = req.body;

  try {
    await createFolder(folderPath);
    res.status(200).end(); // Success
  } catch (error) {
    console.error('Error creating folder:', error);
    res.status(500).json({ error: 'Failed to create the folder' });
  }
}
