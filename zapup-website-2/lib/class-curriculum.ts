// Class Curriculum Helper - Age-appropriate learning guidelines for Classes 6-12
// Provides context for AI answer generation and content validation

export interface ClassInfo {
  age: string;
  level: 'elementary' | 'secondary' | 'higher secondary';
  cognitiveStage: string;
  learningFocus: string[];
  mathematicalAbilities: string[];
  answerComplexity: {
    maxSteps: number;
    explanationLevel: 'basic' | 'intermediate' | 'advanced' | 'comprehensive';
    terminologyLevel: 'simple' | 'moderate' | 'advanced' | 'technical';
    exampleTypes: string[];
  };
}

export const CLASS_CURRICULUM_INFO: Record<string, ClassInfo> = {
  '6': {
    age: '11-12',
    level: 'elementary',
    cognitiveStage: 'Concrete operational stage - learning through examples and visual aids',
    learningFocus: [
      'Building number sense with whole numbers and basic fractions',
      'Introduction to negative numbers (integers)',
      'Basic geometric shapes and their properties',
      'Simple data collection and interpretation',
      'Practical measurement and calculation'
    ],
    mathematicalAbilities: [
      'Can understand basic arithmetic operations',
      'Beginning to grasp abstract concepts like negative numbers',
      'Can solve simple word problems',
      'Understands basic geometric concepts',
      'Can interpret simple charts and graphs'
    ],
    answerComplexity: {
      maxSteps: 3,
      explanationLevel: 'basic',
      terminologyLevel: 'simple',
      exampleTypes: ['real-world examples', 'visual diagrams', 'step-by-step arithmetic']
    }
  },
  
  '7': {
    age: '12-13',
    level: 'elementary',
    cognitiveStage: 'Transition to abstract thinking - can handle basic algebraic concepts',
    learningFocus: [
      'Rational numbers and their operations',
      'Introduction to algebraic expressions',
      'Basic equation solving',
      'Geometric constructions and reasoning',
      'Data handling and simple statistics'
    ],
    mathematicalAbilities: [
      'Can work with fractions, decimals confidently',
      'Beginning to understand variables and expressions',
      'Can solve simple linear equations',
      'Understands congruence and basic proofs',
      'Can create and interpret data representations'
    ],
    answerComplexity: {
      maxSteps: 4,
      explanationLevel: 'basic',
      terminologyLevel: 'simple',
      exampleTypes: ['algebraic manipulation', 'geometric constructions', 'word problems']
    }
  },
  
  '8': {
    age: '13-14',
    level: 'elementary',
    cognitiveStage: 'Developing abstract thinking - ready for algebraic reasoning',
    learningFocus: [
      'Rational number operations and properties',
      'Linear equations in one variable',
      'Quadrilaterals and their properties',
      'Mensuration (areas and volumes)',
      'Algebraic identities and factorization'
    ],
    mathematicalAbilities: [
      'Comfortable with rational number arithmetic',
      'Can solve linear equations systematically',
      'Understands geometric properties and proofs',
      'Can apply formulas for areas and volumes',
      'Beginning to work with algebraic identities'
    ],
    answerComplexity: {
      maxSteps: 5,
      explanationLevel: 'intermediate',
      terminologyLevel: 'moderate',
      exampleTypes: ['algebraic solutions', 'geometric proofs', 'formula applications']
    }
  },
  
  '9': {
    age: '14-15',
    level: 'secondary',
    cognitiveStage: 'Abstract thinking development - can handle coordinate systems',
    learningFocus: [
      'Number systems (rational and irrational)',
      'Polynomial expressions and factorization',
      'Coordinate geometry introduction',
      'Euclidean geometry and proofs',
      'Basic statistics and probability'
    ],
    mathematicalAbilities: [
      'Can work with different number systems',
      'Understands polynomial operations',
      'Can plot points and understand coordinate plane',
      'Can construct geometric proofs',
      'Understands basic probability concepts'
    ],
    answerComplexity: {
      maxSteps: 6,
      explanationLevel: 'intermediate',
      terminologyLevel: 'moderate',
      exampleTypes: ['coordinate solutions', 'algebraic proofs', 'statistical analysis']
    }
  },
  
  '10': {
    age: '15-16',
    level: 'secondary',
    cognitiveStage: 'Formal operational thinking - ready for systematic problem solving',
    learningFocus: [
      'Real number system completion',
      'Quadratic equations and their applications',
      'Trigonometry introduction',
      'Coordinate geometry applications',
      'Probability and statistics applications'
    ],
    mathematicalAbilities: [
      'Can work with real numbers confidently',
      'Understands quadratic relationships',
      'Can apply trigonometric ratios',
      'Can solve coordinate geometry problems',
      'Can interpret and create statistical analyses'
    ],
    answerComplexity: {
      maxSteps: 7,
      explanationLevel: 'intermediate',
      terminologyLevel: 'moderate',
      exampleTypes: ['trigonometric applications', 'quadratic solutions', 'coordinate proofs']
    }
  },
  
  '11': {
    age: '16-17',
    level: 'higher secondary',
    cognitiveStage: 'Advanced abstract thinking - ready for calculus concepts',
    learningFocus: [
      'Sets, relations, and functions',
      'Trigonometric functions and identities',
      'Mathematical induction and reasoning',
      'Limits and derivatives introduction',
      'Advanced coordinate geometry'
    ],
    mathematicalAbilities: [
      'Can handle complex functional relationships',
      'Understands proof by induction',
      'Can work with limits conceptually',
      'Can apply derivative concepts',
      'Can solve complex geometric problems'
    ],
    answerComplexity: {
      maxSteps: 8,
      explanationLevel: 'advanced',
      terminologyLevel: 'advanced',
      exampleTypes: ['calculus applications', 'proof techniques', 'function analysis']
    }
  },
  
  '12': {
    age: '17-18',
    level: 'higher secondary',
    cognitiveStage: 'Mature abstract thinking - ready for advanced mathematical concepts',
    learningFocus: [
      'Advanced calculus (derivatives and integrals)',
      'Matrix algebra and determinants',
      'Vector algebra and 3D geometry',
      'Differential equations',
      'Advanced probability and statistics'
    ],
    mathematicalAbilities: [
      'Can apply calculus to solve real problems',
      'Understands matrix operations and properties',
      'Can work in three-dimensional space',
      'Can set up and solve differential equations',
      'Can perform advanced statistical analysis'
    ],
    answerComplexity: {
      maxSteps: 10,
      explanationLevel: 'comprehensive',
      terminologyLevel: 'technical',
      exampleTypes: ['calculus solutions', 'matrix operations', 'vector calculations', 'statistical modeling']
    }
  }
};

// Learning progression helpers
export function getClassInfo(classLevel: string): ClassInfo | null {
  return CLASS_CURRICULUM_INFO[classLevel] || null;
}

export function getAgeGroup(classLevel: string): string {
  const info = getClassInfo(classLevel);
  return info ? info.age : 'Unknown';
}

export function getMaxStepsForClass(classLevel: string): number {
  const info = getClassInfo(classLevel);
  return info ? info.answerComplexity.maxSteps : 5;
}

export function getExplanationLevelForClass(classLevel: string): string {
  const info = getClassInfo(classLevel);
  return info ? info.answerComplexity.explanationLevel : 'intermediate';
}

export function getTerminologyLevelForClass(classLevel: string): string {
  const info = getClassInfo(classLevel);
  return info ? info.answerComplexity.terminologyLevel : 'moderate';
}

// Helper to generate class-appropriate language guidelines
export function getLanguageGuidelinesForClass(classLevel: string): string {
  const info = getClassInfo(classLevel);
  if (!info) return 'Use clear, moderate language';
  
  const guidelines = {
    'basic': 'Use simple, everyday language. Avoid technical terms. Explain every step clearly.',
    'intermediate': 'Use moderate technical language with explanations. Students understand basic math terminology.',
    'advanced': 'Use proper mathematical terminology. Students can follow complex reasoning.',
    'comprehensive': 'Use full mathematical language. Students are preparing for higher education.'
  };
  
  return guidelines[info.answerComplexity.explanationLevel];
}

// Helper to suggest teaching approaches for each class
export function getTeachingApproachForClass(classLevel: string): string[] {
  const info = getClassInfo(classLevel);
  if (!info) return ['Use step-by-step approach'];
  
  const approaches = {
    'elementary': [
      'Use visual aids and diagrams',
      'Connect to real-world examples',
      'Break down into simple steps',
      'Use repetition for reinforcement'
    ],
    'secondary': [
      'Encourage logical reasoning',
      'Use multiple solution methods',
      'Connect concepts to previous learning',
      'Introduce formal mathematical language gradually'
    ],
    'higher secondary': [
      'Emphasize mathematical rigor',
      'Use formal proofs and derivations',
      'Connect to real-world applications',
      'Prepare for competitive exams and higher studies'
    ]
  };
  
  return approaches[info.level];
}

// Validation helper for appropriate mathematical complexity
export function isComplexityAppropriate(
  classLevel: string, 
  stepCount: number, 
  usesAdvancedTerminology: boolean
): boolean {
  const info = getClassInfo(classLevel);
  if (!info) return false;
  
  if (stepCount > info.answerComplexity.maxSteps) {
    return false;
  }
  
  if (usesAdvancedTerminology && ['simple', 'moderate'].includes(info.answerComplexity.terminologyLevel)) {
    return false;
  }
  
  return true;
}