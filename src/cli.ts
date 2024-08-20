#!/usr/bin/env node

import fs from "fs/promises";
import path from "path";
import { getFigmaIcons } from "./lib.js";

function parseArgs(args: string[]) {
  const s = args.join(" ");
  const fileKey = (s.match(/\-\-file[\s=](\S+)/) || [])[1];
  const outputDirectory = (s.match(/\-\-out[\s=](\S+)/) || [])[1];
  return { fileKey, outputDirectory };
}

const { fileKey, outputDirectory } = parseArgs(process.argv);
const figmaAccessToken = process.env.FIGMA_PAT;

if (!figmaAccessToken) {
  throw new Error(
    "Missing environment variable FIGMA_PAT. Please generate a personal access token (PAT) under Figma account settings and pass the value in the FIGMA_PAT environment variable."
  );
}

if (!fileKey) {
  throw new Error(
    "Missing file key. Please pass the Figma file key via a --file argument. For example, given the file URL https://www.figma.com/design/FILE_KEY/Icon-Playground, pass the following: --file FILE_KEY"
  );
}

if (!outputDirectory) {
  throw new Error(
    "Please pass the path to the output directory relative to the current working directory. For example: --out ./icons"
  );
}

const outPath = path.resolve(process.cwd(), outputDirectory);

// Fetch the existing files in the output directory
let existingFiles: string[] = [];
try {
  existingFiles = await fs.readdir(outPath);
} catch (err) {
  // If the directory doesn't exist, we'll create it
  await fs.mkdir(outPath, { recursive: true });
}

const icons = await getFigmaIcons({
  figmaAccessToken,
  fileKey,
});

// Create a Set of new file names to check for deletions
const newFileNames = new Set(
  icons.map((icon) => {
    return `${[
      icon.name.replace(/\s/g, "_"),
      ...Object.values(icon.properties),
    ].join("-")}.svg`.toLowerCase();
  })
);

let removedCount = 0;

// Identify and remove files that are no longer in Figma
for (const file of existingFiles) {
  if (!newFileNames.has(file)) {
    await fs.rm(path.resolve(outPath, file));
    console.log(`🩸 Removed ${file}`);
    removedCount++;
  }
}

let syncedCount = 0;

// Write and log the new/updated files
await Promise.all(
  icons.map(async (icon) => {
    const fileName = `${[
      icon.name.replace(/\s/g, "_"),
      ...Object.values(icon.properties),
    ].join("-")}.svg`.toLowerCase();

    await fs.writeFile(path.resolve(outPath, fileName), icon.svg);

    console.log(`✅ Synced ${fileName}`);
    syncedCount++;
  })
);

console.log(
  `----------------------------------\n🔥 Total icons synced: ${syncedCount}`
);
if (removedCount > 0) {
  console.log(`💀 Total icons removed: ${removedCount}`);
}
