import { google } from "googleapis";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function getAuthSheets() {
  const keyPath = path.resolve(__dirname, "../../credentials.json");
  const key = JSON.parse(fs.readFileSync(keyPath, "utf8"));
  const auth = new google.auth.GoogleAuth({
    credentials: key,
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const client = await auth.getClient();

  const googleSheets = google.sheets({
    version: "v4",
    auth,
  });

  // const spreadsheetId = "1OsB2vdp79OmePmCAwwure_SSrTTNjaBTe1V8QltXZ6c";
  // spreadsheetId,
  return {
    auth,
    client,
    googleSheets,
  };
}

export const TOOL_CONFIG = {
  gsheets_read: {
    name: "gsheets_read",
    description: "Read data from a Google Sheet.",
  },
};

export const SERVER_CONFIG = {
  name: "mcp-sheets-service",
  version: "1.0.0",
  description: "A service that provides access to Google Sheets.",
};
