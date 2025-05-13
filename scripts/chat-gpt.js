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

// TODO: Add an option to save the chat
// TODO: Look into operator integration

const openAi = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

(async () => {
  console.log(`\nType ${Shade.red('exit')} to end the conversation`);
  console.log('Beginning conversation with ChatGPT (model gpt-4.1)...\n');

  while (true) {
    // Get the User input
    const userInput = await io.question(`${Shade.green('You:')} `);
    console.log('');

    // If the User types 'exit', exit the chat
    if (userInput === 'exit') {
      console.log('\nExiting chat...\n');
      process.exit(0);
    }

    // Append User message to chat log
    chatMessages.push({
      role: 'user',
      content: userInput,
    });

    // Have some animated loader run
    let i = 0;
    const spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    const spinner = setInterval(() => {
      process.stdout.write(`\r${Shade.cyan(spinnerFrames[i % spinnerFrames.length])} Thinking...`);
      i += 1;
    }, 100);

    // Send the request to OpenAI
    const response = await openAi.responses.create({
      model: 'gpt-4.1',
      input: chatMessages,
      tools: [
        {
          type: 'web_search_preview',
          user_location: {
            type: 'approximate',
            country: 'US',
            city: 'Santa Barbara',
            region: 'Santa Barbara',
            timezone: 'America/Los_Angeles',
          },
        },
      ],
    });

    // Extract the reply
    const reply = response.output_text;

    // Clear the loading animation
    clearInterval(spinner);
    stdout.write('\x1b[1A'); // Move cursor up
    stdout.write('\x1b[2K'); // Clear line

    // Log the reply to the console
    console.log(`${Shade.yellow('\nAssistant: ')} ${reply}\n`);

    // Append the reply to the chat history
    chatMessages.push({
      role: 'assistant',
      content: reply,
    });
  }
})();
