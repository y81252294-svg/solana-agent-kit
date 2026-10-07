import { createServerFn } from "@tanstack/react-start";
import { readFile } from "fs/promises";
import { join } from "path";

export const readHomeMarkdownFile = createServerFn({ method: "GET" }).handler(
  async () => {
    const filePath = join(process.cwd(), "src/markdown/home.md");
    const text = await readFile(filePath, "utf-8");
    return text;
  },
);
