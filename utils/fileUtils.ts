import axios from 'axios';

export const copyFilesToTempFolder = async (
  selectedTempFiles: File[]
): Promise<void> => {
  const sourceFolder = 'public/docs';
  const destinationFolder = 'public/temp';

  try {
    for (const fileName of selectedTempFiles) {
      const sourceUrl = `${sourceFolder}/${fileName}`;
      const destinationUrl = `${destinationFolder}/${fileName}`;

      const response = await axios.get(sourceUrl, {
        responseType: 'blob',
      });

      const fileBlob = new Blob([response.data]);

      await axios.put(destinationUrl, fileBlob, {
        headers: {
          'Content-Type': fileBlob.type,
        },
      });
    }

    console.log('Files copied successfully!');
  } catch (error) {
    console.error('An error occurred:', error);
  }
};
