const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

const { getFigmaIcons } = require("../lib");

describe("getFigmaIcons", () => {
  const mockFileKey = process.env.FIGMA_FILE_KEY || "mock-file-key"; // Use .env value or fallback
  const figmaAccessToken = process.env.FIGMA_PAT || "mock-access-token"; // Use .env value or fallback

  it("should fetch icons successfully when nodeIds are provided", async () => {
    const mockNodeIds = ["2002:25", "3003:45"];
    const result = await getFigmaIcons({
      figmaAccessToken,
      fileKey: mockFileKey,
      nodeIds: mockNodeIds,
    });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should fetch all icons when nodeIds are not provided", async () => {
    const result = await getFigmaIcons({
      figmaAccessToken,
      fileKey: mockFileKey,
    });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should throw an error for invalid fileKey", async () => {
    const invalidFileKey = "invalid-key";

    await expect(
      getFigmaIcons({
        figmaAccessToken,
        fileKey: invalidFileKey,
      })
    ).rejects.toThrow("An error occurred while fetching Figma file");
  });
});
