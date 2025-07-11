export type SubscriptionType = "explorer" | "scholar" | "achiever" | "genius_plus";

export const SUBSCRIPTION_FEATURES = {
  explorer: {
    maxQuestionsPerDay: 5,
    allowedClasses: ["6", "7", "8"],
    maxClassesSelectable: 3, // Can select multiple classes
    personalizedExplanations: false,
    progressTracking: false,
    parentalEmail: false,
    chatbot: true,
    chatbotMode: "limited", // limited = hardcoded prompts only
    examMode: false,
    mockTests: false,
    imageUpload: false,
    audioExplanations: false,
    homeworkAutoCheck: false,
    parentDashboard: false,
    progressReport: false,
    mentorChat: false,
    betaAccess: false,
  },
  scholar: {
    maxQuestionsPerDay: Infinity,
    allowedClasses: ["6", "7", "8", "9", "10", "11", "12"], // Can choose any class
    maxClassesSelectable: 1, // But can only select 1 class at a time
    personalizedExplanations: true,
    progressTracking: true,
    parentalEmail: true,
    chatbot: true,
    chatbotMode: "limited", // limited = hardcoded prompts only
    examMode: false,
    mockTests: false,
    imageUpload: false,
    audioExplanations: false,
    homeworkAutoCheck: false,
    parentDashboard: false,
    progressReport: false,
    mentorChat: false,
    betaAccess: false,
  },
  achiever: {
    maxQuestionsPerDay: Infinity,
    allowedClasses: ["6", "7", "8", "9", "10", "11", "12"],
    maxClassesSelectable: Infinity, // Can select multiple classes
    personalizedExplanations: true,
    progressTracking: true,
    parentalEmail: true,
    chatbot: true,
    chatbotMode: "limited", // limited = hardcoded prompts only
    examMode: true,
    mockTests: true,
    imageUpload: true,
    audioExplanations: true,
    homeworkAutoCheck: false,
    parentDashboard: false,
    progressReport: false,
    mentorChat: false,
    betaAccess: false,
  },
  genius_plus: {
    maxQuestionsPerDay: Infinity,
    allowedClasses: ["6", "7", "8", "9", "10", "11", "12"],
    maxClassesSelectable: Infinity, // Can select multiple classes
    personalizedExplanations: true,
    progressTracking: true,
    parentalEmail: true,
    chatbot: true,
    chatbotMode: "full", // full = hardcoded prompts + free chat
    examMode: true,
    mockTests: true,
    imageUpload: true,
    audioExplanations: true,
    homeworkAutoCheck: true,
    parentDashboard: true,
    progressReport: true,
    mentorChat: true,
    betaAccess: true,
  },
}; 