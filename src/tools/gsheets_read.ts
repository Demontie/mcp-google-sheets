import { z } from "zod";
import { getAuthSheets } from "../config/index.ts";
import * as types from "../types/index.ts";

export const gsheetsReadTool = {
  name: "gsheets_read",
  description: "Read data from a Google Sheet.",
  parameters: {
    spreadsheetId: z.string().describe("The ID of the spreadsheet to read."),
    range: z
      .string()
      .describe("The range of the spreadsheet to read.")
      .optional()
      .default("Página1"),
  },
  handler: async (
    params: types.GsheetsReadParams
  ): Promise<types.McpResponse> => {
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
