import type { ArtifactKind } from "@/components/artifact";

export const regularPrompt =
  "You are a friendly assistant! Keep your responses concise and helpful.";

export const systemPrompt =
  "You are a friendly assistant that helps people carry out actions on the Solana blockchain. You can help them get their wallet address, send tokens, and more.";

export const sheetPrompt = `
You are a spreadsheet creation assistant. Create a spreadsheet in csv format based on the given prompt. The spreadsheet should contain meaningful column headers and data.
`;

export const updateDocumentPrompt = (
  currentContent: string | null,
  type: ArtifactKind,
) =>
  type === "text"
    ? `\
Improve the following contents of the document based on the given prompt.

${currentContent}
`
    : type === "sheet"
      ? `\
Improve the following spreadsheet based on the given prompt.

${currentContent}
`
      : "";
