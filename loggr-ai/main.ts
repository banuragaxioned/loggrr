import 'dotenv/config';
import fs from "fs";
import path from "path";
import { TimeLog } from './schema';
import * as typechat from './TypeChat/typechat';
import { createTypeScriptJsonValidator } from './TypeChat/ts/validate';
import { createOpenAILanguageModel, } from './TypeChat/model';
import { processRequests, } from './TypeChat/interactive';
import { rawProjects, sampleProjects } from './projects-data';

const viewSchema = fs.readFileSync(path.join(__dirname, "schema.ts"), 'utf-8');

const model = createOpenAILanguageModel(process.env.OPENAI_API_KEY!, 'gpt-3.5-turbo');
const validator = createTypeScriptJsonValidator<TimeLog>(viewSchema, "TimeLog");
const translator = typechat.createJsonTranslator(model, validator);

// (async () => {
  // processRequests("Loggr > ", process.argv[2], async (request) => {
  //   const response = await translator.translate(request);
  //   if (!response.success) {
  //     console.log(response.message);
  //     return;
  //   }
  //   console.log(response);
  // });
  
  // const response = await translator.translate('2hour cfm - dev and standup');
  // console.log(JSON.stringify(response, null, 2));
// })();

export async function loggr (input: string) {
  try {
    const response = await translator.translate(input);
    if (!response.success) {
      return { message: response.message, status: 400 };
    }
    return { message: 'Success', result: response.data.data, status: 200 };
  } catch (error) { 
    return { message: 'Error processing request', error, status: 500 };
  }
}
