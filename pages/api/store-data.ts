import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import bodyParser from 'body-parser';
import formidable from "formidable";
import path from "path";
import fs from "fs";
import { error } from "console";

let uniqueId = 0;

// Middleware to parse JSON data
export const config = {
  api: {
    bodyParser: true,
  },
};

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const data = req.body;
  const jsonData = JSON.stringify(data);

  try {
    const filePath = path.join(process.cwd(), "data.json");
    let previousData = [];

    // Read existing data from the file
    try {
      const fileContent = fs.readFileSync(filePath, "utf8");
      previousData = JSON.parse(fileContent);
    } catch (error) {
      // If the file doesn't exist or is empty, previousData will be an empty array
    }

    // Generate the unique ID for the new data
    const newId = ++uniqueId;

    // Add the new data with the unique ID
    const newData = {
      id: newId,
      ...data,
    };

    // Add the new data to the existing data
    previousData.push(newData);

    // Write the updated data back to the file
    fs.writeFileSync(filePath, JSON.stringify(previousData), "utf8");

    res.status(200).json('Success json data added');
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

export default handler;
