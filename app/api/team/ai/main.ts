import path from "path";
import { promises as fsPromises } from "fs";

import * as typechat from "./TypeChat/typechat";
import { createTypeScriptJsonValidator } from "./TypeChat/ts/validate";
import { createOpenAILanguageModel } from "./TypeChat/model";

type TimeLog = {
  data: {
    projectId: string;
    projectName: string;
    taskId?: string;
    taskName?: string;
    milestoneId: string;
    milestoneName: string;
    time: number; // in minutes
    date: string; // DD-MM-YYYY, this is today's date
    comment: string;
    billable: boolean; // default is true
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
const response = translator.translate("2hour cfm - dev and standup");

export async function loggr(input: string, projects: any) {
  console.log(input, projects, "hit");
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
