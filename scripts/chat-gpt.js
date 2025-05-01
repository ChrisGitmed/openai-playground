import OpenAI from "openai";
import { argv } from "dark-args";
import { Shade } from "js-shade";

const { prompt } = argv
const openAi = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

if (!prompt) {
  console.log('No prompt provided. Exiting script');
  process.exit(0);
}

console.log('Querying ChatGPT (model gpt-4.1)...\n')
console.log(`Prompt: ${Shade.green(argv.prompt)}\n`)
const response = await openAi.responses.create({
  model: "gpt-4.1",
  input: argv.prompt
});

console.log(Shade.yellow(response.output_text), '\n');