// components/FileUpload.tsx

import { useRef } from 'react';

const FileUploadtoSupa = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async () => {
    const files = inputRef.current?.files;

    if (!files || files.length === 0) {
      alert('Please select files to upload.');
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append('file', file));

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert('Files uploaded successfully!');
        // Do something with the uploaded data if needed
      } else {
        alert('Error uploading files: ' + data.error);
      }
    } catch (error) {
      alert('An error occurred during file upload.');
    }
  };

  return (
    <div>
      <input type="file" multiple ref={inputRef} />
      <button onClick={handleFileUpload}>Upload Files</button>
    </div>
  );
};

export default FileUploadtoSupa;
