// Test subject matching logic
const availableSubjects = ["accounts", "business studies", "environmental studies", "chemistry", "economics", "mathematics", "physics"]

const subjectAliases = {
  'accountancy': ['accounts', 'accountancy'],
  'business-studies': ['business-studies', 'business studies'],
  'environmental-studies': ['environmental-studies', 'environmental studies'],
  'political-science': ['political-science', 'political science']
}

const normalizedAvailableSubjects = availableSubjects.map(s => s.toLowerCase().replace(/\s+/g, '-'))

console.log('Available subjects (raw):', availableSubjects)
console.log('Normalized available subjects:', normalizedAvailableSubjects)

// Test subjects to check
const testSubjects = [
  { id: 'accountancy', name: 'Accountancy' },
  { id: 'business-studies', name: 'Business Studies' },
  { id: 'environmental-studies', name: 'Environmental Studies' },
  { id: 'physics', name: 'Physics' },
  { id: 'english', name: 'English' }
]

console.log('\n=== TESTING SUBJECT MATCHES ===\n')

testSubjects.forEach(subject => {
  const subjectId = subject.id.toLowerCase()
  const normalizedId = subjectId.replace(/\s+/g, '-')

  console.log(`\nChecking: ${subject.name} (${normalizedId})`)

  // Check if subject ID matches directly
  if (normalizedAvailableSubjects.includes(normalizedId)) {
    console.log(`  ✓ Direct match found!`)
    return
  }

  // Check aliases
  const aliases = subjectAliases[normalizedId]
  if (aliases) {
    console.log(`  Aliases found:`, aliases)
    const matched = aliases.some(alias => {
      const normalizedAlias = alias.toLowerCase().replace(/\s+/g, '-')
      const isMatch = normalizedAvailableSubjects.includes(normalizedAlias)
      console.log(`    - "${alias}" → "${normalizedAlias}" → ${isMatch ? 'MATCH ✓' : 'no match'}`)
      return isMatch
    })
    if (matched) {
      console.log(`  ✓ Alias match found!`)
    } else {
      console.log(`  ✗ No alias match`)
    }
  } else {
    console.log(`  ✗ No match (no aliases defined)`)
  }
})
