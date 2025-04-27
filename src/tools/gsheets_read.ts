import { z } from "zod";
import { getAuthSheets } from "../config/index.ts";
import * as types from "../types/index.ts";
import { InteractiveHandler } from "./interactive_handler.ts";

const schema = {
  spreadsheetId: z.string().describe("The ID of the spreadsheet to read."),
  range: z
    .string()
    .describe("The range of the spreadsheet to read.")
    .optional()
    .default("Página1"),
};

export const gsheetsReadTool = {
  name: "gsheets_read",
  description: "Read data from a Google Sheet.",
  parameters: schema,
  handler: async (
    params: types.GsheetsReadParams
  ): Promise<types.McpResponse> => {
    const interactiveHandler = new InteractiveHandler(z.object(schema));

    // Check for missing parameters and return a prompt response if any are missing
    const promptResponse = await interactiveHandler.handle(params);
    if (promptResponse.content.length > 0) {
      return promptResponse;
    }

    const { spreadsheetId, range } = params;
    const { googleSheets } = await getAuthSheets();
    const response = await googleSheets.spreadsheets.values.get({
      spreadsheetId,
      range,
      dateTimeRenderOption: "FORMATTED_STRING",
    });

    const content: types.McpTextContent = {
      type: "text",
      text: `Google Sheets Results:\n\n${JSON.stringify(
        response.data,
        null,
        2
      )}`,
    };

    return {
      content: [content],
    };
  },
};
