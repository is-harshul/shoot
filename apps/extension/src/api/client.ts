import { z } from "zod";

import { getApiBaseUrl } from "@/config/env";

export class ApiError extends Error {
  public readonly status: number;
  public readonly body?: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

const baseUrl = getApiBaseUrl();

const toUrl = (path: string): string => {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const normalisedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalisedPath}`;
};

const parseErrorBody = async (response: Response) => {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
};

export const request = async <Schema extends z.ZodTypeAny>(
  path: string,
  schema: Schema,
  init?: RequestInit
): Promise<z.infer<Schema>> => {
  const response = await fetch(toUrl(path), {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const body = await parseErrorBody(response);
    throw new ApiError(
      `Request failed with status ${response.status}`,
      response.status,
      body
    );
  }

  const json = await response.json();
  return schema.parse(json);
};
