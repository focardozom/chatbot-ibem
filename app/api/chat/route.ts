import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

// Use gpt-4.1 model which is the latest available
const openAIModelName = process.env.OPENAI_MODEL || 'gpt-4.1';

const model = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(req: NextRequest) {
  try {
    const { messages, simulationMode } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid messages format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Check if OpenAI API key is set
    if (!process.env.OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: 'OPENAI_API_KEY is not set' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Determine system message based on mode
    let systemMessage;
    
    if (simulationMode) {
      // In simulation mode, the first message should already be the system prompt
      // which contains the adolescent profile instructions
      systemMessage = messages[0].content;
      
      // Remove the system message from the messages array since we'll add it back
      messages.shift();
    } else {
      // Standard chat mode
      systemMessage = "You are IBEM, a friendly and helpful assistant. You respond concisely and accurately to user questions. When you don't know an answer, you admit it rather than making something up.";
    }

    try {
      console.log(`Using OpenAI model: ${openAIModelName}`);
      
      const result = await streamText({
        model: model(openAIModelName),
        maxTokens: 512,
        messages: [
          {
            role: 'system',
            content: systemMessage,
          },
          ...messages,
        ],
      });
      
      const stream = result.toDataStream();
  
      return new Response(stream, {
        status: 200,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    } catch (err) {
      console.error('OpenAI API error:', err);
      const modelError = err as Error;
      
      // Try with a fallback model if the specified model fails
      try {
        console.log('Falling back to gpt-4.1 model');
        
        const fallbackResult = await streamText({
          model: model('gpt-4.1'),
          maxTokens: 512,
          messages: [
            {
              role: 'system',
              content: systemMessage,
            },
            ...messages,
          ],
        });
        
        const fallbackStream = fallbackResult.toDataStream();
    
        return new Response(fallbackStream, {
          status: 200,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      } catch (fallbackErr) {
        console.error('Fallback model error:', fallbackErr);
        return new Response(JSON.stringify({ 
          error: 'OpenAI API error',
          message: modelError.message || 'Failed to generate response'
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
  } catch (err) {
    console.error('Chat API error:', err);
    const error = err as Error;
    return new Response(JSON.stringify({ 
      error: 'Something went wrong',
      message: error.message || 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 