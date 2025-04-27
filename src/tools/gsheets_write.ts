import { z } from "zod";
import { getAuthSheets } from "../config/index.ts";
import * as types from "../types/index.ts";
import { InteractiveHandler } from "./interactive_handler.ts";

const schema = {
  spreadsheetId: z.string().describe("The ID of the spreadsheet to read."),
  values: z.object({
    product: z.string().describe("row 1, column 1"),
    value: z.string().describe("row 1, column 2"),
    date: z.string().describe("row 1, column 3"),
  }),
  range: z
    .string()
    .describe("The range of the spreadsheet to read.")
    .optional()
    .default("Página1"),
};

function normalizeCurrency(value: string): string {
  let cleanValue = value.replace(/[^\d,.]/g, "");
  cleanValue = cleanValue.replace(/\./g, ",").replace(/,+/g, ",");
  cleanValue = cleanValue.replace(/^,|,$/g, "");
  const parts = cleanValue.split(",");
  let result = parts[0] || "0";
  if (parts[1]) {
    result += "," + parts[1].slice(0, 2);
  } else {
    result += ",00";
  }

  return result;
}

export const gsheetsWriteTool = {
  name: "gsheets_write",
  description: "Write data to a Google Sheet.",
  parameters: schema,
  handler: async (
    params: types.GsheetsWriteParams
  ): Promise<types.McpResponse> => {
    const interactiveHandler = new InteractiveHandler(z.object(schema));

    // Check for missing parameters and return a prompt response if any are missing
    const promptResponse = await interactiveHandler.handle(params);
    if (promptResponse.content.length > 0) {
      return promptResponse;
    }

    const { spreadsheetId, range, values } = params;
    const { googleSheets } = await getAuthSheets();

    const response = await googleSheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [values.product, normalizeCurrency(values.value), values.date],
        ],
      },
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
