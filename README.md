# Figma Icon Getter

This is a CLI and TypeScript library to fetch icons from [Figma](https://www.figma.com/) using their [REST API](https://www.figma.com/developers/api).

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

5. Generate a [personal access token](https://help.figma.com/hc/en-us/articles/8085703771159-Manage-personal-access-tokens).
> [!NOTE]
> Make sure that the token has access to your icon file

![icons-05](https://github.com/user-attachments/assets/f4700368-8037-4caf-9610-685d2eb223ae)

## CLI usage

> [!NOTE]
> Requires a recent version of [Node.js](https://nodejs.org).

Run the following command to download icons from Figma:

```bash
FIGMA_PAT=<access token> npx figma-icon-getter --file <file key> --out <output directory>
```

Explanation:

- `FIGMA_PAT=<access token>`: Replace `<access token>` with the Figma personal access token generated in the [Design Setup](#design-setup) section above.
- `--file <file key>`: Replace `<file key>` with the file key appearing in the URL of the Figma file. For example, given a URL of `https://www.figma.com/design/mfiglkk3bXQwetaRsftZQz/Icon-Playground?node-id=0-1&t=RDa9Ma6rkxW492eB-0`, the file key is `mfiglkk3bXQwetaRsftZQz`.
- `--out <output directory>`: Replace `<output directory>` with the path to the directory where you want to download the icon SVG files.

> [!TIP]
> If you need to convert the downloaded icon SVG files to React icon components, we recommend [SVGR](https://react-svgr.com).

## API

### Installation

```bash
npm install figma-icon-getter
```

### Usage

You can use the `getFigmaIcons` function to conveniently download icon SVGs:

```typescript
import { getFigmaIcons } from "figma-icon-getter";

const icons = await getFigmaIcons({
  figmaAccessToken: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  fileKey: "mfiglkk3bXQwetaRsftZQz",
});

console.log(icons);

/* example output
[
  {
    "name": "Acorn",
    "properties": {
      "variant": "outlined",
      "size": "16"
    },
    "svg": "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\">...</svg>\n"
  }
]
*/
```

#### Parameters

- `figmaAccessToken`: The Figma personal access token generated in the [Design Setup](#design-setup) section above
- `fileKey`: The file key appearing in the URL of the Figma file. For example, given a URL of `https://www.figma.com/design/mfiglkk3bXQwetaRsftZQz/Icon-Playground?node-id=0-1&t=RDa9Ma6rkxW492eB-0`, the file key is `mfiglkk3bXQwetaRsftZQz`.

#### Return value

```typescript
Promise<
  {
    name: string;
    properties: Record<string, string>;
    svg: string;
  }[]
>;
```

- `name`: The name of the icon, derived from the component set that the icon component belongs to
- `properties`: A record containing the component properties defined in Figma
- `svg`: The icon SVG data

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue to discuss any changes.
