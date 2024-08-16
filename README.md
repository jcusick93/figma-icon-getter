# Figma Icon Getter

This script exports icons from a Figma file into a specified output directory.

## Prerequisites
- Node.js: Make sure you have Node.js installed. You can download it from nodejs.org.
- Figma Personal Access Token (PAT): You'll need a Figma Personal Access Token (PAT) to authenticate with the Figma API. You can generate one from your Figma account settings.
Setup

1. Install the package via NPM

   ```bash
   npm install figma-icon-getter
   ```

2. Install Dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root of your project and add your Figma Personal Access Token:

   ```bash
   FIGMA_PAT=your-figma-personal-access-token
   ```

4. Run the Script. Use the following command to run the script:


## How It Works
The script parses the command-line arguments to get the Figma file key and the output directory.
It then uses your Figma PAT to fetch the icons from the specified Figma file.
Finally, it saves the icons as SVG files in the specified output directory.

## Troubleshooting
- Missing FIGMA_PAT: Ensure that you've set the FIGMA_PAT environment variable in your .env file.
- Missing --file argument: Ensure that you pass the correct Figma file key with the --file argument.
- Missing --out argument: Ensure that you specify a valid output directory with the --out argument.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue to discuss any changes.
