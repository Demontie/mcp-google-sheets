# MCP Google Sheets Integration

This project provides a Model Context Protocol (MCP) server that enables reading and writing data to Google Sheets. It uses the Google Sheets API to interact with spreadsheets and provides tools for data synchronization.

## Table of Contents

- [Features](#features)
- [Installation and Usage](#installation-and-usage)
- [Cursor Configuration](#cursor-configuration)
- [License](#license)

## Features

### Google Sheets Tools

- **gsheets_read**

  - Description: Read data from a Google Sheet
  - Parameters:
    - `spreadsheetId` (string, required): The ID of the spreadsheet to read
    - `range` (string, optional, default: "Página1"): The range of cells to read
  - Returns: The data from the specified range in the spreadsheet

- **gsheets_write**
  - Description: Write data to a Google Sheet
  - Parameters:
    - `spreadsheetId` (string, required): The ID of the spreadsheet to write to
    - `values` (object, required): The data to write, containing:
      - `product` (string): Product name
      - `value` (string): Product value
      - `date` (string): Date of the entry
    - `range` (string, optional, default: "Página1"): The range where to write the data
  - Returns: Confirmation of the write operation

## Installation and Usage

### Prerequisites

- Node.js (version 23 or higher)
- Google Sheets API credentials
- Cursor IDE

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. [Configure your Google Sheets API credentials](#configure-your-google-sheets-api-credentials)
4. [Cursor Configuration](#cursor-configuration)

## Configure your Google Sheets API credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API:
   - In the left sidebar, click on "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click on it and then click "Enable"
4. Create credentials:
   - In the left sidebar, click on "APIs & Services" > "Credentials"
   - Click "Create Credentials" and select "Service Account"
   - Fill in the service account details and click "Create and Continue"
   - For the role, select "Editor" or "Owner" depending on your needs
   - Click "Done"
5. Generate and download the JSON key:
   - In the service account list, click on the newly created account
   - Go to the "Keys" tab
   - Click "Add Key" > "Create new key"
   - Choose JSON format and click "Create"
   - The key file will be downloaded automatically
6. Share your Google Sheet:
   - Open your Google Sheet
   - Click the "Share" button
   - Add the service account email (found in the JSON key file) as an editor
7. Add credentials.json to the project root

## Cursor Configuration

To configure this MCP server with Cursor:

1. Open Cursor
2. Press:
   - Windows/Linux: `Ctrl + Shift + P`
   - macOS: `Cmd + Shift + P`
3. Type "Configure MCP Server" and select it
4. Add the appropriate configuration based on your setup:

#### For Windows (without WSL) or Linux:

```json
{
  "mcpServers": {
    "google-sheets": {
      "command": "node",
      "args": ["ABSOLUTE_PATH_TO_PROJECT/src/index.ts"]
    }
  }
}
```

#### For WSL Users:

```json
{
  "mcpServers": {
    "google-sheets": {
      "command": "wsl.exe",
      "args": [
        "-e",
        "ABSOLUTE_PATH_TO_NODE/.nvm/versions/node/v22.15.2/bin/node",
        "ABSOLUTE_PATH_TO_PROJECT/src/index.ts"
      ]
    }
  }
}
```

## License

This project is licensed under the ISC License.
