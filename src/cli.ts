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

await fs.rm(outPath, { force: true, recursive: true });
await fs.mkdir(outPath, { recursive: true });

const icons = await getFigmaIcons({
  figmaAccessToken,
  fileKey,
});

await Promise.all(
  icons.map((icon) =>
    fs.writeFile(
      path.resolve(
        outPath,
        `${[
          icon.name.replace(/\s/g, "_"),
          ...Object.values(icon.properties),
        ].join("-")}.svg`.toLowerCase()
      ),
      icon.svg
    )
  )
);
