import type {
  AccountParserInterface,
  EventParserInterface,
  InstructionParserInterface,
  ParserOutput,
} from "@solanafm/explorer-kit";

export interface InstructionParserResponse {
  name: string;
  layout: InstructionParserInterface["instructionsLayout"];
  data: ParserOutput;
}

export interface AccountParserResponse {
  name: string;
  layout: AccountParserInterface["accountLayouts"];
  data: ParserOutput;
}
