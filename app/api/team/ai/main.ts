import path from "path";
import { promises as fsPromises } from "fs";

import * as typechat from "./typechat/typechat";
import { createTypeScriptJsonValidator } from "./typechat/ts/validate";
import { createOpenAILanguageModel } from "./typechat/model";

type TimeLog = {
  data: {
    id: number;
    name: string;
    milestone?: {
      id: number;
      name: string;
    };
    task?: {
      id: number;
      name: string;
    };
    billable?: boolean;
    time?: number;
    comments?: string | "";
    date: string;
  }[];
};

async function readSchema() {
  try {
    const viewSchema = await fsPromises.readFile(path.join(process.cwd(), "app/api/team/ai", "schema.ts"), "utf-8");
    return viewSchema; // or do whatever you want with the schema
  } catch (error) {
    console.error("Error reading schema:", error);
  }
}

const schema = await readSchema();

const model = createOpenAILanguageModel(process.env.OPENAI_API_KEY ?? "", "gpt-3.5-turbo");
const validator = createTypeScriptJsonValidator<TimeLog>(schema ?? "", "TimeLog");
const translator = typechat.createJsonTranslator(model, validator);

export async function loggr(input: string) {
  if (!input) return { message: "No input provided", status: 400 };

  try {
    const response = await translator.translate(input);
    if (!response.success) {
      return { message: response.message, status: 400 };
    }

    return { message: "Success", result: response.data, status: 200 };
  } catch (error) {
    return { message: "Error processing request", error, status: 500 };
  }
}