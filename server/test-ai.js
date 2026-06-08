import { chatWithAI } from './services/aiService.js';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

async function test() {
  try {
    const res = await chatWithAI('hii');
    console.log('SUCCESS:', res);
  } catch (err) {
    console.error('ERROR:', err);
  }
}
test();
