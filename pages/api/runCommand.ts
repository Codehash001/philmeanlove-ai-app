import { exec } from 'child_process';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { command } = req.body;
    if (!command) {
      return res.status(400).send('Command is required');
    }

    exec(command, (error, stdout, stderr) => {
      if (error) {
        return res.status(500).send(error.message);
      }
      if (stderr) {
        return res.status(500).send(stderr);
      }
      return res.status(200).send(stdout);
    });
  } else {
    return res.status(405).send('Method not allowed');
  }
}
