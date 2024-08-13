import { z } from "zod";

function parseIconName(
  iconName: string,
  acc: [string, string][] = []
): Record<string, string> {
  const match = iconName.match(/^,?\s*([^=]+)=([^,]+)(.*)/);
  if (match) {
    const [_, k, v, tail] = match;
    return parseIconName(tail, acc.concat([[k, v]]));
  }
  return Object.fromEntries(acc);
}

export interface GetFigmaIconParameters {
  figmaAccessToken: string;
  fileKey: string;
}

export async function getFigmaIcons({
  figmaAccessToken,
  fileKey,
}: GetFigmaIconParameters) {
  function figmaFetch(url: string, requestInit?: RequestInit) {
    return fetch(`https://api.figma.com/v1${url}`, {
      ...requestInit,
      headers: {
        ...requestInit?.headers,
        "X-Figma-Token": figmaAccessToken,
      },
    });
  }

  const fileRes = await figmaFetch(`/files/${fileKey}`);

  if (!fileRes.ok) {
    const details = await fileRes.text();
    throw new Error(
      `An error occurred while fetching Figma file with key ${fileKey}. Unexpected ${fileRes.status} response: ${details}`
    );
  }

  const iconMetadata = z
    .object({
      componentSets: z.record(
        z.string(),
        z.object({
          name: z.string(),
        })
      ),
      components: z
        .record(
          z.string(),
          z
            .object({
              name: z.string(),
              componentSetId: z.string(),
            })
            .transform(({ name, ...rest }) => ({
              ...rest,
              properties: parseIconName(name),
            }))
        )
        .transform((components) =>
          Object.entries(components).map(([id, iconMetadata]) => ({
            id,
            ...iconMetadata,
          }))
        ),
    })
    .transform(({ componentSets, ...file }, ctx) => {
      const components = file.components.map(({ componentSetId, ...rest }) => ({
        componentSetId,
        name: componentSets[componentSetId]?.name,
        ...rest,
      }));
      for (const { componentSetId, name } of components) {
        if (!name) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Unable to get icon name: Component set with id ${componentSetId} was not found.`,
          });
          return z.NEVER;
        }
      }
      return components.map(({ componentSetId: _, ...rest }) => rest);
    })
    .parse(await fileRes.json());

  const iconRefsRes = await figmaFetch(
    `/images/${fileKey}?ids=${iconMetadata
      .map(({ id }) => id)
      .join(",")}&format=svg`
  );

  return await z
    .object({
      images: z.record(z.string(), z.string().url()),
    })
    .transform(({ images }, ctx) =>
      Promise.all(
        Object.entries(images).map(async ([id, url]) => {
          const iconMeta = iconMetadata.find((meta) => meta.id === id);
          if (!iconMeta) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Unable to find icon metadata for id ${id}.`,
            });
            return z.NEVER;
          }
          const fileRes = await fetch(url);
          if (!fileRes.ok) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Unexpected ${fileRes.status} (${fileRes.statusText}) response while fetching image with id ${id} from ${url}.`,
            });
            return z.NEVER;
          }
          const { name, properties } = iconMeta;
          return {
            name,
            properties,
            svg: await fileRes.text(),
          };
        })
      )
    )
    .parseAsync(await iconRefsRes.json());
}
