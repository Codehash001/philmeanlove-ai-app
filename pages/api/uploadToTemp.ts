import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get the selectedTempFiles array from the request body
    const { selectedTempoFiles } = req.body;

    // Check if the selectedTempFiles array is empty
    if (!Array.isArray(selectedTempoFiles) || selectedTempoFiles.length === 0) {
      throw new Error('No files selected');
    }

    // Specify the destination folder where you want to copy the files
    const destinationFolder = path.resolve(process.cwd(), 'public/temp');

    // Create the destination folder if it doesn't exist
    if (!fs.existsSync(destinationFolder)) {
      fs.mkdirSync(destinationFolder, { recursive: true });
    }

    // Iterate over each file in the selectedTempFiles array
    selectedTempoFiles.forEach((file: { path: string; name: string }) => {
      // Check if the file object has a valid path
      if (!file.path || typeof file.path !== 'string') {
        throw new Error('Invalid file object');
      }

      const sourceFilePath = file.path;
      const destinationFilePath = path.join(destinationFolder, file.name);

      // Use fs.copyFile to copy the file from the source to the destination
      fs.copyFile(sourceFilePath, destinationFilePath, (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`Successfully copied ${sourceFilePath} to ${destinationFilePath}`);
        }
      });
    });

    // Send a success response
    res.status(200).json({ message: 'Files copied successfully' });
  } catch (error) {
    // Handle any errors that occurred during the file copying process
    console.error(error);
    res.status(500).json({ message: 'An error occurred while copying files' });
  }
}
