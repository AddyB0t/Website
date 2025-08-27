// Universal Content Validator for Classes 6-12
// Validates if mathematical content is appropriate for each class level

// Age-appropriate topics for each class level (Indian CBSE/ICSE curriculum)
const CLASS_APPROPRIATE_TOPICS = {
  '6': [
    'whole numbers', 'integers', 'fractions', 'decimals', 'basic geometry',
    'perimeter', 'area', 'data handling', 'ratio and proportion', 'percentage',
    'basic mensuration', 'symmetry', 'practical geometry', 'algebra introduction'
  ],
  '7': [
    'integers', 'fractions', 'decimals', 'algebraic expressions', 'simple equations',
    'lines and angles', 'triangles', 'congruence', 'comparing quantities', 'rational numbers',
    'perimeter and area', 'data handling', 'visualizing solid shapes', 'exponents and powers'
  ],
  '8': [
    'rational numbers', 'linear equations', 'quadrilaterals', 'practical geometry',
    'data handling', 'squares and square roots', 'cubes and cube roots', 'mensuration',
    'algebraic expressions and identities', 'factorization', 'introduction to graphs',
    'playing with numbers'
  ],
  '9': [
    'number systems', 'polynomials', 'coordinate geometry', 'linear equations in two variables',
    'introduction to euclids geometry', 'lines and angles', 'triangles', 'quadrilaterals',
    'areas of parallelograms and triangles', 'circles', 'constructions', 'herons formula',
    'surface areas and volumes', 'statistics', 'probability'
  ],
  '10': [
    'real numbers', 'polynomials', 'pair of linear equations in two variables', 'quadratic equations',
    'arithmetic progressions', 'triangles', 'coordinate geometry', 'introduction to trigonometry',
    'some applications of trigonometry', 'circles', 'constructions', 'areas related to circles',
    'surface areas and volumes', 'statistics', 'probability'
  ],
  '11': [
    'sets', 'relations and functions', 'trigonometric functions', 'principle of mathematical induction',
    'complex numbers and quadratic equations', 'linear inequalities', 'permutations and combinations',
    'binomial theorem', 'sequences and series', 'straight lines', 'conic sections',
    'introduction to three dimensional geometry', 'limits and derivatives', 'mathematical reasoning',
    'statistics', 'probability'
  ],
  '12': [
    'relations and functions', 'inverse trigonometric functions', 'matrices', 'determinants',
    'continuity and differentiability', 'applications of derivatives', 'integrals',
    'applications of integrals', 'differential equations', 'vector algebra',
    'three dimensional geometry', 'linear programming', 'probability'
  ]
};

// Topics that are too advanced for each class level
const INAPPROPRIATE_TOPICS_BY_CLASS = {
  '6': [
    'calculus', 'derivatives', 'integrals', 'regression', 'correlation', 'matrices', 'determinants',
    'trigonometry', 'coordinate geometry', 'quadratic equations', 'polynomials', 'probability theory',
    'complex numbers', 'logarithms', 'exponential functions', 'limits'
  ],
  '7': [
    'calculus', 'derivatives', 'integrals', 'regression', 'correlation', 'matrices', 'determinants',
    'trigonometry', 'coordinate geometry', 'quadratic equations', 'polynomials', 'probability theory',
    'complex numbers', 'logarithms', 'exponential functions', 'limits', 'binomial theorem'
  ],
  '8': [
    'calculus', 'derivatives', 'integrals', 'regression', 'correlation', 'matrices', 'determinants',
    'trigonometry', 'coordinate geometry', 'quadratic equations', 'advanced polynomials',
    'probability theory', 'complex numbers', 'logarithms', 'exponential functions', 'limits',
    'binomial theorem', 'permutations', 'combinations'
  ],
  '9': [
    'calculus', 'derivatives', 'integrals', 'regression analysis', 'correlation coefficient',
    'matrices', 'determinants', 'advanced trigonometry', 'complex numbers', 'logarithms',
    'exponential functions', 'limits', 'binomial theorem', 'mathematical induction'
  ],
  '10': [
    'calculus', 'derivatives', 'integrals', 'regression analysis', 'correlation coefficient',
    'matrices', 'determinants', 'complex numbers', 'logarithms', 'exponential functions',
    'limits', 'binomial theorem', 'mathematical induction', 'advanced statistics'
  ],
  '11': [
    'advanced calculus', 'partial derivatives', 'multiple integrals', 'differential equations',
    'vector calculus', 'fourier series', 'laplace transforms', 'advanced probability theory'
  ],
  '12': [] // Most advanced topics are appropriate for Class 12
};

// Keywords that indicate advanced mathematical concepts
const ADVANCED_KEYWORDS = [
  'regression line', 'correlation coefficient', 'standard deviation', 'variance',
  'hypothesis testing', 'chi-square', 'normal distribution', 'z-score', 't-test',
  'anova', 'partial derivative', 'multiple integral', 'fourier transform',
  'laplace transform', 'eigenvalue', 'eigenvector', 'linear transformation'
];

// Physics/Science keywords that shouldn't appear in pure mathematics
const NON_MATH_KEYWORDS = [
  'physics', 'velocity', 'acceleration', 'force', 'momentum', 'energy',
  'power', 'resistance', 'current', 'voltage', 'mass', 'weight', 'density',
  'chemistry', 'molecule', 'atom', 'element', 'compound', 'reaction'
];

export interface ContentValidationResult {
  isAppropriate: boolean;
  reason?: string;
  suggestedAction?: string;
  inappropriateTopics?: string[];
  confidence: number; // 0-1 scale
}

export function validateContentForClass(
  questionText: string, 
  classLevel: string,
  subject: string = 'mathematics'
): ContentValidationResult {
  // Validate inputs
  if (!questionText || !classLevel) {
    return {
      isAppropriate: false,
      reason: 'Missing question text or class level',
      confidence: 1.0
    };
  }

  // Normalize inputs
  const questionLower = questionText.toLowerCase();
  const normalizedClass = classLevel.toString();
  
  // Check if class level is valid
  if (!CLASS_APPROPRIATE_TOPICS[normalizedClass]) {
    return {
      isAppropriate: false,
      reason: `Unsupported class level: ${classLevel}`,
      confidence: 1.0
    };
  }

  const inappropriateTopics = INAPPROPRIATE_TOPICS_BY_CLASS[normalizedClass] || [];
  const foundInappropriateTopics: string[] = [];
  
  // Check for inappropriate topics specific to the class level
  for (const topic of inappropriateTopics) {
    if (questionLower.includes(topic.toLowerCase())) {
      foundInappropriateTopics.push(topic);
    }
  }
  
  // Check for advanced mathematical keywords
  for (const keyword of ADVANCED_KEYWORDS) {
    if (questionLower.includes(keyword.toLowerCase()) && !inappropriateTopics.includes(keyword)) {
      // Only flag if it's advanced for this class
      const classNum = parseInt(normalizedClass);
      if (classNum < 11) { // Advanced stats topics not appropriate before Class 11
        foundInappropriateTopics.push(keyword);
      }
    }
  }
  
  // Check for non-mathematics content (unless it's integrated learning)
  if (subject.toLowerCase() === 'mathematics') {
    for (const keyword of NON_MATH_KEYWORDS) {
      if (questionLower.includes(keyword.toLowerCase())) {
        foundInappropriateTopics.push(`${keyword} (non-mathematics content)`);
      }
    }
  }
  
  // Calculate confidence based on number of inappropriate topics found
  const confidence = foundInappropriateTopics.length > 0 ? 
    Math.min(1.0, foundInappropriateTopics.length * 0.3) : 0.1;
  
  if (foundInappropriateTopics.length > 0) {
    return {
      isAppropriate: false,
      reason: `Contains advanced/inappropriate topics: ${foundInappropriateTopics.join(', ')}`,
      suggestedAction: getClassSpecificSuggestion(normalizedClass, foundInappropriateTopics),
      inappropriateTopics: foundInappropriateTopics,
      confidence
    };
  }
  
  // Additional checks for question quality
  const qualityCheck = validateQuestionQuality(questionText, normalizedClass);
  if (!qualityCheck.isValid) {
    return {
      isAppropriate: false,
      reason: qualityCheck.reason,
      suggestedAction: qualityCheck.suggestion,
      confidence: 0.8
    };
  }
  
  return { 
    isAppropriate: true, 
    confidence: 0.9 
  };
}

function getClassSpecificSuggestion(classLevel: string, inappropriateTopics: string[]): string {
  const classNum = parseInt(classLevel);
  
  if (inappropriateTopics.some(topic => topic.includes('calculus') || topic.includes('derivative'))) {
    if (classNum < 11) {
      return 'Calculus topics are introduced in Classes 11-12. Focus on algebra and geometry for now.';
    }
  }
  
  if (inappropriateTopics.some(topic => topic.includes('regression') || topic.includes('correlation'))) {
    if (classNum < 11) {
      return 'Advanced statistics are covered in Classes 11-12. Try basic data handling instead.';
    }
  }
  
  if (inappropriateTopics.some(topic => topic.includes('matrix') || topic.includes('determinant'))) {
    if (classNum < 12) {
      return 'Matrices and determinants are typically covered in Class 12.';
    }
  }
  
  const suggestedClass = Math.min(12, classNum + 2);
  return `These topics are typically covered in Class ${suggestedClass} or higher. Please check with your teacher.`;
}

function validateQuestionQuality(questionText: string, classLevel: string): {
  isValid: boolean;
  reason?: string;
  suggestion?: string;
} {
  // Check for minimum question length
  if (questionText.trim().length < 10) {
    return {
      isValid: false,
      reason: 'Question text is too short',
      suggestion: 'Questions should be at least 10 characters long and clearly stated.'
    };
  }
  
  // Check for placeholder text
  const placeholders = ['insert value', 'fill in', 'replace with', 'enter value', 'put value here'];
  const questionLower = questionText.toLowerCase();
  
  for (const placeholder of placeholders) {
    if (questionLower.includes(placeholder)) {
      return {
        isValid: false,
        reason: 'Question contains placeholder text',
        suggestion: 'Complete the question with actual values before asking for help.'
      };
    }
  }
  
  // Check for incomplete questions
  if (questionText.endsWith('...') || questionText.includes('[insert') || questionText.includes('<insert')) {
    return {
      isValid: false,
      reason: 'Question appears to be incomplete',
      suggestion: 'Please provide the complete question text.'
    };
  }
  
  return { isValid: true };
}

// Helper function to get appropriate topics for a class
export function getAppropriateTopicsForClass(classLevel: string): string[] {
  return CLASS_APPROPRIATE_TOPICS[classLevel] || [];
}

// Helper function to get inappropriate topics for a class  
export function getInappropriateTopicsForClass(classLevel: string): string[] {
  return INAPPROPRIATE_TOPICS_BY_CLASS[classLevel] || [];
}

// Helper function to suggest alternative class levels
export function suggestAppropriateClassLevel(questionText: string): string[] {
  const suggestions: string[] = [];
  
  for (const classLevel of Object.keys(CLASS_APPROPRIATE_TOPICS)) {
    const validation = validateContentForClass(questionText, classLevel);
    if (validation.isAppropriate && validation.confidence > 0.7) {
      suggestions.push(classLevel);
    }
  }
  
  return suggestions.sort((a, b) => parseInt(a) - parseInt(b));
}