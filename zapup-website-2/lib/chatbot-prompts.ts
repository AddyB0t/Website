// zapup-website-2/lib/chatbot-prompts.ts
// Predefined prompts for limited chatbot mode
// Students can select from these common questions about any subject problems

export interface ChatbotPrompt {
  id: string
  label: string
  prompt: string
  category: 'understanding' | 'solving' | 'checking' | 'concept'
}

export const CHATBOT_PROMPTS: ChatbotPrompt[] = [
  // Understanding the problem
  {
    id: 'understand-question',
    label: 'I don\'t understand this question',
    prompt: 'I don\'t understand what this question is asking. Can you help me break it down?',
    category: 'understanding'
  },
  {
    id: 'key-terms',
    label: 'What do these terms mean?',
    prompt: 'What do the key terms in this question mean? Can you explain them?',
    category: 'understanding'
  },
  {
    id: 'what-to-find',
    label: 'What am I supposed to find?',
    prompt: 'What am I supposed to find or work out in this problem?',
    category: 'understanding'
  },

  // Solving approach
  {
    id: 'where-to-start',
    label: 'Where do I start?',
    prompt: 'I\'m not sure where to start with this problem. Can you give me a hint about the first step?',
    category: 'solving'
  },
  {
    id: 'what-method',
    label: 'Which method should I use?',
    prompt: 'What method or approach should I use to solve this problem?',
    category: 'solving'
  },
  {
    id: 'next-step',
    label: 'What\'s the next step?',
    prompt: 'I\'ve started working on this problem but I\'m stuck. What should I do next?',
    category: 'solving'
  },
  {
    id: 'different-approach',
    label: 'Is there another way to solve this?',
    prompt: 'Is there a different way or method to solve this problem?',
    category: 'solving'
  },

  // Checking work
  {
    id: 'check-answer',
    label: 'How do I check if my answer is correct?',
    prompt: 'How can I check if my answer is correct? What should I look for?',
    category: 'checking'
  },
  {
    id: 'common-mistakes',
    label: 'What are common mistakes here?',
    prompt: 'What are some common mistakes students make with this type of problem?',
    category: 'checking'
  },
  {
    id: 'answer-reasonable',
    label: 'Does my answer make sense?',
    prompt: 'Does my answer seem reasonable? How can I tell if it makes sense?',
    category: 'checking'
  },

  // Concept understanding
  {
    id: 'why-this-method',
    label: 'Why do we use this method?',
    prompt: 'Why do we use this particular method or approach for this type of problem?',
    category: 'concept'
  },
  {
    id: 'real-world-application',
    label: 'How is this used in real life?',
    prompt: 'How is this concept used in real life? Can you give me an example?',
    category: 'concept'
  },
  {
    id: 'similar-problems',
    label: 'What are similar problems like this?',
    prompt: 'What other types of problems are similar to this one? How can I recognize them?',
    category: 'concept'
  }
]

export const PROMPT_CATEGORIES = {
  understanding: {
    label: 'Understanding the Problem',
    icon: '🤔',
    description: 'Help with understanding what the question is asking'
  },
  solving: {
    label: 'Solving Approach',
    icon: '💡',
    description: 'Getting hints about how to solve the problem'
  },
  checking: {
    label: 'Checking Your Work',
    icon: '✅',
    description: 'Verifying your solution and avoiding mistakes'
  },
  concept: {
    label: 'Understanding Concepts',
    icon: '📚',
    description: 'Learning about the concepts involved'
  }
}

// Get prompts by category
export function getPromptsByCategory(category: string): ChatbotPrompt[] {
  return CHATBOT_PROMPTS.filter(prompt => prompt.category === category)
}

// Get prompt by ID
export function getPromptById(id: string): ChatbotPrompt | undefined {
  return CHATBOT_PROMPTS.find(prompt => prompt.id === id)
} 