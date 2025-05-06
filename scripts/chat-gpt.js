import OpenAI from 'openai';
import { Shade } from 'js-shade';
import { createInterface } from 'readline/promises';
import {
  stdin,
  stdout,
} from 'process';

const io = createInterface({
  input: stdin,
  output: stdout,
});

const chatMessages = [];

const openAi = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

(async () => {
  console.log(`\nType ${Shade.red('exit')} to end the conversation at any time`);
  console.log('Beginning conversation with ChatGPT (model gpt-4.1)...\n');

  while (true) {
    // Get the User input
    const userInput = await io.question(`${Shade.green('You:')} `);

    // If the User types 'exit', exit the chat
    if (userInput === 'exit') {
      console.log('Exiting....');
      process.exit(0);
    }

    // Append User message to chat log
    chatMessages.push({
      role: 'user',
      content: userInput,
    });

    // Send the request to OpenAI
    const response = await openAi.chat.completions.create({
      model: 'gpt-4.1',
      messages: chatMessages,
    });

    // Extract the reply
    const reply = response.choices[0].message.content;

    // Log the reply to the console
    console.log(`${Shade.yellow('\nAssistant: ')} ${reply}\n`);

    // Append the reply to the chat history
    chatMessages.push({
      role: 'assistant',
      content: reply,
    });
  }
})();
