// src/pages/api/convert-code.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const form = new formidable.IncomingForm({ uploadDir: '/tmp', keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parse error:', err);
      return res.status(500).send('Upload error');
    }

    const zipFile = files.zipfile as formidable.File;
    const zipPath = zipFile.filepath;

    const scriptPath = path.join(process.cwd(), 'scripts', 'summary_generator.py');

    exec(`python3 ${scriptPath} ${zipPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error('Python execution error:', stderr);
        return res.status(500).json({ summary: '❌ Failed to process zip.' });
      }

      return res.status(200).json({ summary: stdout });
    });
  });
};

export default handler;
