import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import path from "path";
import fs from "fs/promises";

export const config = {
  api: {
    bodyParser: false,
  },
};

const readFile = (
  req: NextApiRequest,
  saveLocally?: boolean
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const options: formidable.Options = {};
  if (saveLocally) {
    options.uploadDir = path.join(process.cwd(), "/public/docs");
    options.filename = (name, ext, path, form) => {
      return "" + path.originalFilename;
    };
  }
  options.maxFileSize = 4000 * 1024 * 1024;
  const form = formidable(options);
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

const getFilesHandler: NextApiHandler = async (req : NextApiRequest, res : NextApiResponse) => {
  try {
    const files = await fs.readdir(
      path.join(process.cwd(), 'public', 'docs')
    );
    res.status(200).json({ files });
  } catch (error) {
    console.error('Error reading directory:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteFileHandler: NextApiHandler = async (req : NextApiRequest, res : NextApiResponse) => {
  const { fileName } = req.query;
  try {
    await fs.unlink(path.join(process.cwd() + "/public/docs", fileName as string));
    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    // 
  }
};

const uploadFileHandler: NextApiHandler = async (req : NextApiRequest, res : NextApiResponse) => {
  try {
    await fs.readdir(path.join(process.cwd() + "/public", "/docs"));
  } catch (error) {
    await fs.mkdir(path.join(process.cwd() + "/public", "/docs"));
  }
  await readFile(req, true);
  res.status(200).json({ message: "File uploaded successfully" });
};

const handler: NextApiHandler = (req : NextApiRequest, res : NextApiResponse) => {
  if (req.method === "GET") {
    getFilesHandler(req, res);
  } else if (req.method === "DELETE") {
    deleteFileHandler(req, res);
  } else if (req.method === "POST") {
    uploadFileHandler(req, res);
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

export default handler;
