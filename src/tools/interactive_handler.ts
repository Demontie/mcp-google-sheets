import { ZodSchema } from "zod";
import * as types from "../types/index.ts";

type MissingParameters = {
  [key: string]: string;
};

export class InteractiveHandler<T extends ZodSchema> {
  private missingParams: MissingParameters = {};
  private schema: T;

  constructor(schema: T) {
    this.schema = schema;
  }

  async handle(params: any): Promise<types.McpResponse> {
    const missingParams = this.getMissingParameters(params);

    if (Object.keys(missingParams).length > 0) {
      this.missingParams = missingParams;
      return this.createPromptResponse();
    }

    this.missingParams = {};
    return {
      content: [],
    };
  }

  private getMissingParameters(params: any): MissingParameters {
    const missing: MissingParameters = {};
    const result = this.schema.safeParse(params);
    if (!result.success) {
      for (const issue of result.error.issues) {
        missing[issue.path.join(".")] = issue.message;
      }
    }

    return missing;
  }

  private createPromptResponse(): types.McpResponse {
    const missingParamNames = Object.keys(this.missingParams);
    const promptText = `Para prosseguir, preciso das seguintes informações:\n${missingParamNames
      .map((param) => `- ${param}`)
      .join("\n")}`;

    const content: types.McpTextContent = {
      type: "text",
      text: promptText,
    };

    return {
      content: [content],
    };
  }
}
