# Chatbot Setup with OpenRouter

This document explains how to set up the AI-powered chatbot for context-aware question help.

## Overview

The chatbot provides intelligent assistance for students working on mathematics questions. It:
- Understands the current question context
- Provides hints without giving direct answers
- Explains mathematical concepts in age-appropriate language
- Maintains conversation history for better context

## Setup Instructions

### 1. Get OpenRouter API Key

1. Visit [OpenRouter](https://openrouter.ai/)
2. Create an account or sign in
3. Go to [API Keys](https://openrouter.ai/keys)
4. Create a new API key
5. Copy the key for the next step

### 2. Configure Environment Variables

Add the following to your `.env.local` file:

```bash
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

### 3. Model Configuration

The chatbot currently uses `anthropic/claude-3.5-sonnet` by default. You can change this in:
- File: `app/api/chatbot/question-help/route.ts`
- Line: `model: 'anthropic/claude-3.5-sonnet'`

Available models include:
- `anthropic/claude-3.5-sonnet` (recommended)
- `anthropic/claude-3-haiku` (faster, cheaper)
- `openai/gpt-4` (alternative)
- `openai/gpt-3.5-turbo` (budget option)

### 4. Cost Considerations

OpenRouter charges per token usage. Approximate costs:
- Claude 3.5 Sonnet: ~$3 per 1M input tokens, ~$15 per 1M output tokens
- Claude 3 Haiku: ~$0.25 per 1M input tokens, ~$1.25 per 1M output tokens

The chatbot is configured with:
- `max_tokens: 500` (limits response length)
- `temperature: 0.7` (balanced creativity)
- Conversation history limited to last 6 messages

## Features

### Context Awareness
- Current question text
- Chapter and section information
- Question difficulty level
- Question number
- Conversation history

### Safety Features
- Educational focus (no direct answers)
- Age-appropriate language
- Fallback responses when API is unavailable
- Error handling with helpful messages

### UI Features
- Floating chat button
- Minimizable chat window
- Real-time typing indicators
- Message timestamps
- Responsive design

## Usage

1. Navigate to any mathematics question
2. Click the blue chat button in the bottom-right corner
3. The chatbot will greet you with context about the current question
4. Ask questions about concepts, methods, or clarifications
5. The chatbot will provide hints and explanations without giving direct answers

## Troubleshooting

### Chatbot not appearing
- Check that you're viewing a question (not chapter/section selection)
- Verify the QuestionChatbot component is imported correctly

### API errors
- Verify your OpenRouter API key is correct
- Check your OpenRouter account has sufficient credits
- Review browser console for detailed error messages

### Fallback responses
- If the API is unavailable, the chatbot provides helpful general tips
- This ensures students still get some assistance even during outages

## Customization

### Changing the system prompt
Edit the `systemPrompt` in `app/api/chatbot/question-help/route.ts` to modify the chatbot's behavior.

### Styling the chat interface
Modify `components/QuestionChatbot.tsx` to change colors, layout, or animations.

### Adding more context
You can extend the API to include additional context like:
- Previous questions in the section
- Student's learning history
- Related topics from other chapters

## Security Notes

- API key should never be exposed to the client
- All requests go through your Next.js API route
- Consider implementing rate limiting for production use
- Monitor API usage to prevent unexpected costs 