import fs from 'fs/promises';

export const ensureDirExists = async (dirPath) => {
  try {
    await fs.access(dirPath);
  } catch {
    console.log(`Directory ${dirPath} does not exist. Creating...`);
    await fs.mkdir(dirPath, { recursive: true });
  }
};
