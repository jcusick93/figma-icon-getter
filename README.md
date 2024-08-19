# Figma Icon Getter

This is a TypeScript library and CLI to fetch icons from [Figma](https://www.figma.com/) using their [REST API](https://www.figma.com/developers/api).

## Benefits
- Automate icon workflow from Figma to production.
- Sync repository with a single Figma file.
- Use [component sets](https://help.figma.com/hc/en-us/articles/360056440594-Create-and-use-variants) in Figma, making it easier for designers to configure options.

## Design Setup
1. Create a new Figma file and notate the [file ID](https://help.figma.com/hc/en-us/articles/360052378433-Bubble-and-Figma#:~:text=The%20file%20ID%20is%20the,from%20your%20browser's%20address%20bar.).

![icons-01](https://github.com/user-attachments/assets/8c8bdf58-51a9-470a-bcf1-034ff2e99ca2)

2. Create a new icons. Make sure to flatten the paths to a single layer.

![icons-02](https://github.com/user-attachments/assets/19b48a6d-39f3-4aac-94e3-b00a5c81a64e)

3. Create a component set.

![icons-03](https://github.com/user-attachments/assets/2a63d39c-0d80-4512-99fe-853b0b307d9b)

4. Add properties to the component, e.g. variant = filled | outlined and size = 16 | 24

![icons-04](https://github.com/user-attachments/assets/5f17baac-3196-44d2-9be0-dfe441fb09e6)

5. Generate a [personal access token](https://help.figma.com/hc/en-us/articles/8085703771159-Manage-personal-access-tokens). Make sure that the token has access to your icon file.

![icons-05](https://github.com/user-attachments/assets/f4700368-8037-4caf-9610-685d2eb223ae)

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
