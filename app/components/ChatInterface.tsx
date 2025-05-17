"use client";

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add an initial greeting message when the component mounts
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'initial-greeting',
          role: 'assistant',
          content: 'Hi, I am IBEM. How can I help you today?',
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }, [messages.length]);

  // Clear success/error messages after 5 seconds
  useEffect(() => {
    if (saveSuccess || saveError) {
      const timer = setTimeout(() => {
        setSaveSuccess(null);
        setSaveError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [saveSuccess, saveError]);

  // Process the streaming response data format
  const processStreamData = (text: string): string => {
    // Filter and extract just the text content
    const contentLines = text.split('\n')
      .filter(line => line.startsWith('0:"'))
      .map(line => {
        // Extract the text between quotes and handle escaped quotes
        const content = line.substring(3, line.length - 1);
        return content
          .replace(/\\"/g, '"')  // Replace escaped quotes
          .replace(/\\n/g, '\n') // Replace escaped newlines
          .replace(/\\t/g, '\t') // Replace escaped tabs
          .replace(/\\\\/, '\\'); // Replace escaped backslashes
      });
    
    return contentLines.join('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Prepare messages for API
    const messagesToSend = [
      ...messages.map(({ role, content }) => ({ role, content })),
      { role: 'user' as const, content: input },
    ];
    
    try {
      // Call chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messagesToSend }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: 'Unknown error',
          message: 'Failed to parse error response'
        }));
        throw new Error(errorData.message || 'Failed to get response');
      }
      
      // Check if the response is a streaming response
      const contentType = response.headers.get('Content-Type') || '';
      
      if (contentType.includes('application/json')) {
        // Handle non-streaming error response
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error from API');
      }
      
      // Get streaming response
      const reader = response.body?.getReader();
      
      if (!reader) {
        throw new Error('Failed to create reader');
      }
      
      // Add assistant message placeholder
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
      };
      
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
      
      // Process streaming response
      const decoder = new TextDecoder();
      let done = false;
      let buffer = '';
      
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        
        if (value) {
          // Decode the chunk and add it to our buffer
          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;
          
          // Process the buffer to extract just the text content
          const text = processStreamData(buffer);
          
          // Update the last message with the processed content
          setMessages((prevMessages) => {
            const newMessages = [...prevMessages];
            const lastMessage = newMessages[newMessages.length - 1];
            
            if (lastMessage && lastMessage.role === 'assistant') {
              // Replace the entire content with the processed text
              // This avoids showing the raw streamed format
              lastMessage.content = text;
            }
            
            return newMessages;
          });
        }
      }
      
      // Process any remaining data in the buffer
      if (buffer) {
        const finalText = processStreamData(buffer);
        
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages];
          const lastMessage = newMessages[newMessages.length - 1];
          
          if (lastMessage && lastMessage.role === 'assistant') {
            lastMessage.content = finalText;
          }
          
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Error getting response:', error);
      
      // Add error message
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error. Please try again.'}`,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveConversation = async () => {
    if (messages.length <= 1) {
      setSaveError('No conversation to save.');
      return;
    }

    if (!title.trim()) {
      setSaveError('Please enter a title for this conversation.');
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          messages: messages.map(m => ({
            role: m.role,
            content: m.content,
            timestamp: m.timestamp || new Date().toISOString()
          }))
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save conversation');
      }

      setSaveSuccess('Conversation saved successfully!');
      setShowSaveDialog(false);
      setTitle('');
    } catch (error) {
      console.error('Error saving conversation:', error);
      setSaveError(error instanceof Error ? error.message : 'Failed to save conversation');
    } finally {
      setIsSaving(false);
    }
  };

  const generateDefaultTitle = () => {
    // Get the first user message or use a default
    const firstUserMessage = messages.find(m => m.role === 'user');
    if (firstUserMessage && firstUserMessage.content) {
      // Limit title length
      const content = firstUserMessage.content;
      return content.length > 30 ? content.substring(0, 30) + '...' : content;
    }
    return `Conversation ${new Date().toLocaleString()}`;
  };

  return (
    <div className="flex h-full flex-col rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Save Conversation</h3>
            <div className="mb-4">
              <label htmlFor="conversation-title" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Title
              </label>
              <input
                type="text"
                id="conversation-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title for this conversation"
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveConversation}
                disabled={isSaving || !title.trim()}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header with Save Button */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2 dark:border-gray-700">
        <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">Chat with IBEM</h2>
        <button
          onClick={() => {
            setTitle(generateDefaultTitle());
            setShowSaveDialog(true);
          }}
          disabled={messages.length <= 1 || isLoading}
          className="rounded bg-green-600 px-3 py-1 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
        >
          Save Conversation
        </button>
      </div>

      {/* Status Messages */}
      {(saveSuccess || saveError) && (
        <div 
          className={`mx-4 mt-2 rounded-md p-3 text-sm ${
            saveSuccess 
              ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
              : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400'
          }`}
        >
          {saveSuccess || saveError}
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-center text-gray-500 dark:text-gray-400">
              Loading...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[75%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="border-t border-gray-200 p-4 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
} 