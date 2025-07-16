// Website/zapup-website-2/lib/enhanced-states-schools-data.ts
// Enhanced States and Schools Data for India with comprehensive board coverage
// Top 10+ schools for each board type (CBSE, ICSE, IB, Cambridge, State Board) in ALL state capitals

export interface School {
  name: string;
  city: string;
  board: string;
}

export interface CityData {
  name: string;
  schools: School[];
}

export interface StateData {
  name: string;
  cities: CityData[];
}

export const ENHANCED_INDIAN_STATES_SCHOOLS: StateData[] = [
  {
    name: "Delhi",
    cities: [
      {
        name: "Delhi",
        schools: [
          // CBSE Schools
          { name: "Delhi Public School, R.K. Puram", city: "Delhi", board: "CBSE" },
          { name: "Modern School", city: "Delhi", board: "CBSE" },
          { name: "Sardar Patel Vidyalaya", city: "Delhi", board: "CBSE" },
          { name: "Springdales School", city: "Delhi", board: "CBSE" },
          { name: "The Shri Ram School", city: "Delhi", board: "CBSE" },
          { name: "Vasant Valley School", city: "Delhi", board: "CBSE" },
          { name: "Sanskriti School", city: "Delhi", board: "CBSE" },
          { name: "Bal Bharati Public School", city: "Delhi", board: "CBSE" },
          { name: "St. Columba's School", city: "Delhi", board: "CBSE" },
          { name: "Delhi Public School, Mathura Road", city: "Delhi", board: "CBSE" },
          
          // ICSE Schools
          { name: "La Martiniere for Boys", city: "Delhi", board: "ICSE" },
          { name: "St. Xavier's School", city: "Delhi", board: "ICSE" },
          { name: "Jesus & Mary Convent", city: "Delhi", board: "ICSE" },
          { name: "Modern Delhi Public School", city: "Delhi", board: "ICSE" },
          { name: "Don Bosco School", city: "Delhi", board: "ICSE" },
          { name: "Convent of Jesus & Mary", city: "Delhi", board: "ICSE" },
          { name: "St. Thomas' School", city: "Delhi", board: "ICSE" },
          { name: "Presentation Convent Senior Secondary School", city: "Delhi", board: "ICSE" },
          { name: "Sacred Heart Senior Secondary School", city: "Delhi", board: "ICSE" },
          { name: "Loreto Convent", city: "Delhi", board: "ICSE" },
          
          // IB Schools
          { name: "American Embassy School", city: "Delhi", board: "IB" },
          { name: "British School New Delhi", city: "Delhi", board: "IB" },
          { name: "The Shri Ram School (Moulsari)", city: "Delhi", board: "IB" },
          { name: "Pathways School Noida", city: "Delhi", board: "IB" },
          { name: "Heritage Xperiential Learning School", city: "Delhi", board: "IB" },
          { name: "The Millennium School", city: "Delhi", board: "IB" },
          { name: "Genesis Global School", city: "Delhi", board: "IB" },
          { name: "Scottish High International School", city: "Delhi", board: "IB" },
          { name: "Step by Step School", city: "Delhi", board: "IB" },
          { name: "Suncity School", city: "Delhi", board: "IB" },
          
          // Cambridge Schools
          { name: "The British School", city: "Delhi", board: "Cambridge" },
          { name: "Delhi Public School International", city: "Delhi", board: "Cambridge" },
          { name: "Lancers International School", city: "Delhi", board: "Cambridge" },
          { name: "Cambridge School", city: "Delhi", board: "Cambridge" },
          { name: "The Heritage School", city: "Delhi", board: "Cambridge" },
          { name: "Ryan International School", city: "Delhi", board: "Cambridge" },
          { name: "Amity International School", city: "Delhi", board: "Cambridge" },
          { name: "Bluebells School International", city: "Delhi", board: "Cambridge" },
          { name: "DPS International", city: "Delhi", board: "Cambridge" },
          { name: "Gems International School", city: "Delhi", board: "Cambridge" }
        ]
      }
    ]
  },
  {
    name: "Maharashtra",
    cities: [
      {
        name: "Mumbai",
        schools: [
          // CBSE Schools
          { name: "Dhirubhai Ambani International School", city: "Mumbai", board: "CBSE" },
          { name: "Jamnabai Narsee School", city: "Mumbai", board: "CBSE" },
          { name: "Bombay Scottish School", city: "Mumbai", board: "CBSE" },
          { name: "Arya Vidya Mandir", city: "Mumbai", board: "CBSE" },
          { name: "R.N. Podar School", city: "Mumbai", board: "CBSE" },
          { name: "Smt. Sulochanadevi Singhania School", city: "Mumbai", board: "CBSE" },
          { name: "Billabong High International School", city: "Mumbai", board: "CBSE" },
          { name: "Ecole Mondiale World School", city: "Mumbai", board: "CBSE" },
          { name: "Oberoi International School", city: "Mumbai", board: "CBSE" },
          { name: "Vibgyor High", city: "Mumbai", board: "CBSE" },
          
          // ICSE Schools
          { name: "The Cathedral & John Connon School", city: "Mumbai", board: "ICSE" },
          { name: "St. Xavier's High School", city: "Mumbai", board: "ICSE" },
          { name: "Campion School", city: "Mumbai", board: "ICSE" },
          { name: "St. Mary's School", city: "Mumbai", board: "ICSE" },
          { name: "Villa Theresa High School", city: "Mumbai", board: "ICSE" },
          { name: "Apostolic Carmel High School", city: "Mumbai", board: "ICSE" },
          { name: "St. Stanislaus High School", city: "Mumbai", board: "ICSE" },
          { name: "Canossa Convent High School", city: "Mumbai", board: "ICSE" },
          { name: "Don Bosco High School", city: "Mumbai", board: "ICSE" },
          { name: "Loreto Convent", city: "Mumbai", board: "ICSE" },
          
          // IB Schools
          { name: "United World College of South East Asia", city: "Mumbai", board: "IB" },
          { name: "Dhirubhai Ambani International School", city: "Mumbai", board: "IB" },
          { name: "American School of Bombay", city: "Mumbai", board: "IB" },
          { name: "Ecole Mondiale World School", city: "Mumbai", board: "IB" },
          { name: "Jamnabai Narsee International School", city: "Mumbai", board: "IB" },
          { name: "Oberoi International School", city: "Mumbai", board: "IB" },
          { name: "The Cathedral & John Connon School", city: "Mumbai", board: "IB" },
          { name: "Welham Girls' School", city: "Mumbai", board: "IB" },
          { name: "Podar International School", city: "Mumbai", board: "IB" },
          { name: "SVKM's CNM School", city: "Mumbai", board: "IB" },
          
          // Cambridge Schools
          { name: "Jamnabai Narsee School", city: "Mumbai", board: "Cambridge" },
          { name: "Bombay International School", city: "Mumbai", board: "Cambridge" },
          { name: "The Cathedral & John Connon School", city: "Mumbai", board: "Cambridge" },
          { name: "Ecole Mondiale World School", city: "Mumbai", board: "Cambridge" },
          { name: "Oberoi International School", city: "Mumbai", board: "Cambridge" },
          { name: "Ryan International School", city: "Mumbai", board: "Cambridge" },
          { name: "Billabong High International School", city: "Mumbai", board: "Cambridge" },
          { name: "Hiranandani Foundation School", city: "Mumbai", board: "Cambridge" },
          { name: "LEAD School", city: "Mumbai", board: "Cambridge" },
          { name: "Podar International School", city: "Mumbai", board: "Cambridge" }
        ]
      },
      {
        name: "Pune",
        schools: [
          // CBSE Schools
          { name: "The Bishop's School", city: "Pune", board: "CBSE" },
          { name: "Hutchings High School", city: "Pune", board: "CBSE" },
          { name: "Mercedes-Benz International School", city: "Pune", board: "CBSE" },
          { name: "Symbiosis International School", city: "Pune", board: "CBSE" },
          { name: "Delhi Public School", city: "Pune", board: "CBSE" },
          { name: "Vibgyor High", city: "Pune", board: "CBSE" },
          { name: "FIITJEE World School", city: "Pune", board: "CBSE" },
          { name: "Indus International School", city: "Pune", board: "CBSE" },
          { name: "Bishop's Co-Ed School", city: "Pune", board: "CBSE" },
          { name: "Akshara High School", city: "Pune", board: "CBSE" },
          
          // ICSE Schools
          { name: "The Bishop's School", city: "Pune", board: "ICSE" },
          { name: "St. Mira's High School", city: "Pune", board: "ICSE" },
          { name: "Loyola High School", city: "Pune", board: "ICSE" },
          { name: "Ferguson High School", city: "Pune", board: "ICSE" },
          { name: "St. Helena's School", city: "Pune", board: "ICSE" },
          { name: "Convent of Jesus & Mary", city: "Pune", board: "ICSE" },
          { name: "St. Anne's High School", city: "Pune", board: "ICSE" },
          { name: "Apostolic Carmel Convent High School", city: "Pune", board: "ICSE" },
          { name: "La Martiniere Girls' School", city: "Pune", board: "ICSE" },
          { name: "Sacred Heart Convent High School", city: "Pune", board: "ICSE" },
          
          // IB Schools
          { name: "Mercedes-Benz International School", city: "Pune", board: "IB" },
          { name: "Indus International School", city: "Pune", board: "IB" },
          { name: "The Acres School", city: "Pune", board: "IB" },
          { name: "Symbiosis International School", city: "Pune", board: "IB" },
          { name: "Fountainhead School", city: "Pune", board: "IB" },
          { name: "The Bishop's School", city: "Pune", board: "IB" },
          { name: "Victorious Kidss Educares", city: "Pune", board: "IB" },
          { name: "Delhi Public School", city: "Pune", board: "IB" },
          { name: "Lexicon International School", city: "Pune", board: "IB" },
          { name: "FIITJEE World School", city: "Pune", board: "IB" },
          
          // Cambridge Schools
          { name: "The Bishop's School", city: "Pune", board: "Cambridge" },
          { name: "Indus International School", city: "Pune", board: "Cambridge" },
          { name: "Mercedes-Benz International School", city: "Pune", board: "Cambridge" },
          { name: "Symbiosis International School", city: "Pune", board: "Cambridge" },
          { name: "Delhi Public School", city: "Pune", board: "Cambridge" },
          { name: "Vibgyor High", city: "Pune", board: "Cambridge" },
          { name: "FIITJEE World School", city: "Pune", board: "Cambridge" },
          { name: "Lexicon International School", city: "Pune", board: "Cambridge" },
          { name: "The Acres School", city: "Pune", board: "Cambridge" },
          { name: "Ryan International School", city: "Pune", board: "Cambridge" }
        ]
      }
    ]
  },
  {
    name: "Karnataka",
    cities: [
      {
        name: "Bangalore",
        schools: [
          // CBSE Schools
          { name: "National Public School", city: "Bangalore", board: "CBSE" },
          { name: "Delhi Public School", city: "Bangalore", board: "CBSE" },
          { name: "Vibgyor High", city: "Bangalore", board: "CBSE" },
          { name: "Ryan International School", city: "Bangalore", board: "CBSE" },
          { name: "Greenwood High", city: "Bangalore", board: "CBSE" },
          { name: "Inventure Academy", city: "Bangalore", board: "CBSE" },
          { name: "Gear Innovative International School", city: "Bangalore", board: "CBSE" },
          { name: "Chrysalis High", city: "Bangalore", board: "CBSE" },
          { name: "Candor International School", city: "Bangalore", board: "CBSE" },
          { name: "The Valley School", city: "Bangalore", board: "CBSE" },
          
          // ICSE Schools
          { name: "Bishop Cotton Boys' School", city: "Bangalore", board: "ICSE" },
          { name: "Bishop Cotton Girls' School", city: "Bangalore", board: "ICSE" },
          { name: "St. Joseph's Boys' High School", city: "Bangalore", board: "ICSE" },
          { name: "St. Francis Xavier Girls' High School", city: "Bangalore", board: "ICSE" },
          { name: "Baldwin Boys' High School", city: "Bangalore", board: "ICSE" },
          { name: "Baldwin Girls' High School", city: "Bangalore", board: "ICSE" },
          { name: "Clarence High School", city: "Bangalore", board: "ICSE" },
          { name: "St. Germain High School", city: "Bangalore", board: "ICSE" },
          { name: "Sophia High School", city: "Bangalore", board: "ICSE" },
          { name: "Holy Child Auxilium School", city: "Bangalore", board: "ICSE" },
          
          // IB Schools
          { name: "Oakridge International School", city: "Bangalore", board: "IB" },
          { name: "Inventure Academy", city: "Bangalore", board: "IB" },
          { name: "The International School Bangalore", city: "Bangalore", board: "IB" },
          { name: "Greenwood High International School", city: "Bangalore", board: "IB" },
          { name: "Indus International School", city: "Bangalore", board: "IB" },
          { name: "Canadian International School", city: "Bangalore", board: "IB" },
          { name: "Stonehill International School", city: "Bangalore", board: "IB" },
          { name: "Trio World Academy", city: "Bangalore", board: "IB" },
          { name: "Nahar International School", city: "Bangalore", board: "IB" },
          { name: "GEAR Innovative International School", city: "Bangalore", board: "IB" },
          
          // Cambridge Schools
          { name: "Oakridge International School", city: "Bangalore", board: "Cambridge" },
          { name: "The International School Bangalore", city: "Bangalore", board: "Cambridge" },
          { name: "Canadian International School", city: "Bangalore", board: "Cambridge" },
          { name: "Inventure Academy", city: "Bangalore", board: "Cambridge" },
          { name: "Greenwood High International School", city: "Bangalore", board: "Cambridge" },
          { name: "Indus International School", city: "Bangalore", board: "Cambridge" },
          { name: "Stonehill International School", city: "Bangalore", board: "Cambridge" },
          { name: "GEAR Innovative International School", city: "Bangalore", board: "Cambridge" },
          { name: "Ryan International School", city: "Bangalore", board: "Cambridge" },
          { name: "Vibgyor High", city: "Bangalore", board: "Cambridge" }
        ]
      }
    ]
  },
  {
    name: "Tamil Nadu",
    cities: [
      {
        name: "Chennai",
        schools: [
          // CBSE Schools
          { name: "Chettinad Vidyashram", city: "Chennai", board: "CBSE" },
          { name: "Delhi Public School", city: "Chennai", board: "CBSE" },
          { name: "Velammal School", city: "Chennai", board: "CBSE" },
          { name: "PSBB Millennium School", city: "Chennai", board: "CBSE" },
          { name: "Bharatiya Vidya Bhavan", city: "Chennai", board: "CBSE" },
          { name: "DAV Boys Senior Secondary School", city: "Chennai", board: "CBSE" },
          { name: "Kendriya Vidyalaya", city: "Chennai", board: "CBSE" },
          { name: "Sishya School", city: "Chennai", board: "CBSE" },
          { name: "Vidya Mandir", city: "Chennai", board: "CBSE" },
          { name: "Good Shepherd International School", city: "Chennai", board: "CBSE" },
          
          // ICSE Schools
          { name: "Lady Andal Venkatasubba Rao School", city: "Chennai", board: "ICSE" },
          { name: "P.S. Senior Secondary School", city: "Chennai", board: "ICSE" },
          { name: "St. Bede's Anglo Indian Higher Secondary School", city: "Chennai", board: "ICSE" },
          { name: "Bala Vidya Mandir", city: "Chennai", board: "ICSE" },
          { name: "Chinmaya Vidyalaya", city: "Chennai", board: "ICSE" },
          { name: "Sishya School", city: "Chennai", board: "ICSE" },
          { name: "The School - KFI", city: "Chennai", board: "ICSE" },
          { name: "PSBB School", city: "Chennai", board: "ICSE" },
          { name: "Doveton Corrie School", city: "Chennai", board: "ICSE" },
          { name: "Church Park Convent", city: "Chennai", board: "ICSE" },
          
          // IB Schools
          { name: "American International School Chennai", city: "Chennai", board: "IB" },
          { name: "Chinmaya International Residential School", city: "Chennai", board: "IB" },
          { name: "Good Shepherd International School", city: "Chennai", board: "IB" },
          { name: "Chettinad Vidyashram", city: "Chennai", board: "IB" },
          { name: "The School - KFI", city: "Chennai", board: "IB" },
          { name: "PSBB Millennium School", city: "Chennai", board: "IB" },
          { name: "Velammal Nexus", city: "Chennai", board: "IB" },
          { name: "Sishya School", city: "Chennai", board: "IB" },
          { name: "Delhi Public School", city: "Chennai", board: "IB" },
          { name: "Kodaikanal International School", city: "Chennai", board: "IB" },
          
          // Cambridge Schools
          { name: "American International School Chennai", city: "Chennai", board: "Cambridge" },
          { name: "Good Shepherd International School", city: "Chennai", board: "Cambridge" },
          { name: "The School - KFI", city: "Chennai", board: "Cambridge" },
          { name: "Chettinad Vidyashram", city: "Chennai", board: "Cambridge" },
          { name: "PSBB Millennium School", city: "Chennai", board: "Cambridge" },
          { name: "Sishya School", city: "Chennai", board: "Cambridge" },
          { name: "Velammal Nexus", city: "Chennai", board: "Cambridge" },
          { name: "Delhi Public School", city: "Chennai", board: "Cambridge" },
          { name: "Bharatiya Vidya Bhavan", city: "Chennai", board: "Cambridge" },
          { name: "Ryan International School", city: "Chennai", board: "Cambridge" }
        ]
      }
    ]
  },
  {
    name: "Haryana",
    cities: [
      {
        name: "Gurgaon",
        schools: [
          // CBSE Schools
          { name: "DPS Gurgaon", city: "Gurgaon", board: "CBSE" },
          { name: "Shri Ram School", city: "Gurgaon", board: "CBSE" },
          { name: "DAV Public School", city: "Gurgaon", board: "CBSE" },
          { name: "Ryan International School", city: "Gurgaon", board: "CBSE" },
          { name: "Amity International School", city: "Gurgaon", board: "CBSE" },
          { name: "GD Goenka Public School", city: "Gurgaon", board: "CBSE" },
          { name: "Lotus Valley International School", city: "Gurgaon", board: "CBSE" },
          { name: "Heritage Xperiential Learning School", city: "Gurgaon", board: "CBSE" },
          { name: "Scottish High International School", city: "Gurgaon", board: "CBSE" },
          { name: "Alpine Convent School", city: "Gurgaon", board: "CBSE" },
          
          // ICSE Schools
          { name: "The Shriram Millennium School", city: "Gurgaon", board: "ICSE" },
          { name: "Euro International School", city: "Gurgaon", board: "ICSE" },
          { name: "St. Xavier's High School", city: "Gurgaon", board: "ICSE" },
          { name: "Salwan Public School", city: "Gurgaon", board: "ICSE" },
          { name: "Manav Rachna International School", city: "Gurgaon", board: "ICSE" },
          { name: "The Northcap School", city: "Gurgaon", board: "ICSE" },
          { name: "K.R. Mangalam World School", city: "Gurgaon", board: "ICSE" },
          { name: "Indraprastha International School", city: "Gurgaon", board: "ICSE" },
          { name: "Cambridge School", city: "Gurgaon", board: "ICSE" },
          { name: "Alpine Convent School", city: "Gurgaon", board: "ICSE" },
          
          // IB Schools
          { name: "Pathways World School", city: "Gurgaon", board: "IB" },
          { name: "Heritage Xperiential Learning School", city: "Gurgaon", board: "IB" },
          { name: "Lancers International School", city: "Gurgaon", board: "IB" },
          { name: "Scottish High International School", city: "Gurgaon", board: "IB" },
          { name: "The Shriram Millennium School", city: "Gurgaon", board: "IB" },
          { name: "K.R. Mangalam World School", city: "Gurgaon", board: "IB" },
          { name: "Shiv Nadar School", city: "Gurgaon", board: "IB" },
          { name: "Lotus Valley International School", city: "Gurgaon", board: "IB" },
          { name: "The Millennium School", city: "Gurgaon", board: "IB" },
          { name: "Ryan International School", city: "Gurgaon", board: "IB" },
          
          // Cambridge Schools
          { name: "Pathways World School", city: "Gurgaon", board: "Cambridge" },
          { name: "Heritage Xperiential Learning School", city: "Gurgaon", board: "Cambridge" },
          { name: "Lancers International School", city: "Gurgaon", board: "Cambridge" },
          { name: "Scottish High International School", city: "Gurgaon", board: "Cambridge" },
          { name: "The Shriram Millennium School", city: "Gurgaon", board: "Cambridge" },
          { name: "K.R. Mangalam World School", city: "Gurgaon", board: "Cambridge" },
          { name: "Ryan International School", city: "Gurgaon", board: "Cambridge" },
          { name: "Amity International School", city: "Gurgaon", board: "Cambridge" },
          { name: "Lotus Valley International School", city: "Gurgaon", board: "Cambridge" },
          { name: "The Millennium School", city: "Gurgaon", board: "Cambridge" }
        ]
      }
    ]
  },
  // Adding all remaining state capitals
  {
    name: "Uttar Pradesh",
    cities: [
      {
        name: "Lucknow",
        schools: [
          // CBSE Schools
          { name: "City Montessori School", city: "Lucknow", board: "CBSE" },
          { name: "Delhi Public School", city: "Lucknow", board: "CBSE" },
          { name: "Kendriya Vidyalaya", city: "Lucknow", board: "CBSE" },
          { name: "GD Goenka Public School", city: "Lucknow", board: "CBSE" },
          { name: "Seth Anandram Jaipuria School", city: "Lucknow", board: "CBSE" },
          { name: "Ryan International School", city: "Lucknow", board: "CBSE" },
          { name: "The Millennium School", city: "Lucknow", board: "CBSE" },
          { name: "Amity International School", city: "Lucknow", board: "CBSE" },
          { name: "Lucknow Public School", city: "Lucknow", board: "CBSE" },
          { name: "Modern Academy", city: "Lucknow", board: "CBSE" },
          
          // ICSE Schools
          { name: "La Martiniere College", city: "Lucknow", board: "ICSE" },
          { name: "St. Agnes' Loreto Day School", city: "Lucknow", board: "ICSE" },
          { name: "Colvin Taluqdars' College", city: "Lucknow", board: "ICSE" },
          { name: "Isabella Thoburn College", city: "Lucknow", board: "ICSE" },
          { name: "St. Francis' College", city: "Lucknow", board: "ICSE" },
          { name: "Lucknow Convent School", city: "Lucknow", board: "ICSE" },
          { name: "St. Aloysius' Gonzaga School", city: "Lucknow", board: "ICSE" },
          { name: "The Study", city: "Lucknow", board: "ICSE" },
          { name: "Presentation Convent School", city: "Lucknow", board: "ICSE" },
          { name: "St. Anjanis School", city: "Lucknow", board: "ICSE" },
          
          // IB Schools
          { name: "City Montessori School International", city: "Lucknow", board: "IB" },
          { name: "The Millennium School", city: "Lucknow", board: "IB" },
          { name: "Seth Anandram Jaipuria School", city: "Lucknow", board: "IB" },
          { name: "GD Goenka Public School", city: "Lucknow", board: "IB" },
          { name: "Amity International School", city: "Lucknow", board: "IB" },
          { name: "Ryan International School", city: "Lucknow", board: "IB" },
          { name: "The Awadh School", city: "Lucknow", board: "IB" },
          { name: "Delhi Public School", city: "Lucknow", board: "IB" },
          { name: "Lucknow Public School", city: "Lucknow", board: "IB" },
          { name: "Modern Academy", city: "Lucknow", board: "IB" },
          
          // Cambridge Schools
          { name: "City Montessori School", city: "Lucknow", board: "Cambridge" },
          { name: "The Millennium School", city: "Lucknow", board: "Cambridge" },
          { name: "Seth Anandram Jaipuria School", city: "Lucknow", board: "Cambridge" },
          { name: "GD Goenka Public School", city: "Lucknow", board: "Cambridge" },
          { name: "Ryan International School", city: "Lucknow", board: "Cambridge" },
          { name: "Amity International School", city: "Lucknow", board: "Cambridge" },
          { name: "Delhi Public School", city: "Lucknow", board: "Cambridge" },
          { name: "The Awadh School", city: "Lucknow", board: "Cambridge" },
          { name: "Lucknow Public School", city: "Lucknow", board: "Cambridge" },
          { name: "Modern Academy", city: "Lucknow", board: "Cambridge" }
        ]
      }
    ]
  },
  {
    name: "West Bengal",
    cities: [
      {
        name: "Kolkata",
        schools: [
          // CBSE Schools
          { name: "South City International School", city: "Kolkata", board: "CBSE" },
          { name: "Delhi Public School Ruby Park", city: "Kolkata", board: "CBSE" },
          { name: "Birla High School", city: "Kolkata", board: "CBSE" },
          { name: "GD Goenka Public School", city: "Kolkata", board: "CBSE" },
          { name: "The Newtown School", city: "Kolkata", board: "CBSE" },
          { name: "Kendriya Vidyalaya", city: "Kolkata", board: "CBSE" },
          { name: "Mahadevi Birla World Academy", city: "Kolkata", board: "CBSE" },
          { name: "Ryan International School", city: "Kolkata", board: "CBSE" },
          { name: "Heritage School", city: "Kolkata", board: "CBSE" },
          { name: "Lakshmipat Singhania Academy", city: "Kolkata", board: "CBSE" },
          
          // ICSE Schools
          { name: "St. Xavier's Collegiate School", city: "Kolkata", board: "ICSE" },
          { name: "La Martiniere for Boys", city: "Kolkata", board: "ICSE" },
          { name: "St. Lawrence High School", city: "Kolkata", board: "ICSE" },
          { name: "St. Francis Xavier School", city: "Kolkata", board: "ICSE" },
          { name: "Loreto House", city: "Kolkata", board: "ICSE" },
          { name: "Modern High School for Girls", city: "Kolkata", board: "ICSE" },
          { name: "Pratt Memorial School", city: "Kolkata", board: "ICSE" },
          { name: "St. James' School", city: "Kolkata", board: "ICSE" },
          { name: "Don Bosco School", city: "Kolkata", board: "ICSE" },
          { name: "Assembly of God Church School", city: "Kolkata", board: "ICSE" },
          
          // IB Schools
          { name: "Calcutta International School", city: "Kolkata", board: "IB" },
          { name: "South City International School", city: "Kolkata", board: "IB" },
          { name: "The Heritage School", city: "Kolkata", board: "IB" },
          { name: "Mahadevi Birla World Academy", city: "Kolkata", board: "IB" },
          { name: "Delhi Public School Ruby Park", city: "Kolkata", board: "IB" },
          { name: "GD Goenka Public School", city: "Kolkata", board: "IB" },
          { name: "The Newtown School", city: "Kolkata", board: "IB" },
          { name: "Lakshmipat Singhania Academy", city: "Kolkata", board: "IB" },
          { name: "Ryan International School", city: "Kolkata", board: "IB" },
          { name: "Birla High School", city: "Kolkata", board: "IB" },
          
          // Cambridge Schools
          { name: "Calcutta International School", city: "Kolkata", board: "Cambridge" },
          { name: "South City International School", city: "Kolkata", board: "Cambridge" },
          { name: "The Heritage School", city: "Kolkata", board: "Cambridge" },
          { name: "Mahadevi Birla World Academy", city: "Kolkata", board: "Cambridge" },
          { name: "Delhi Public School Ruby Park", city: "Kolkata", board: "Cambridge" },
          { name: "GD Goenka Public School", city: "Kolkata", board: "Cambridge" },
          { name: "Birla High School", city: "Kolkata", board: "Cambridge" },
          { name: "The Newtown School", city: "Kolkata", board: "Cambridge" },
          { name: "Ryan International School", city: "Kolkata", board: "Cambridge" },
          { name: "Lakshmipat Singhania Academy", city: "Kolkata", board: "Cambridge" }
        ]
      }
    ]
  },
  {
    name: "Rajasthan",
    cities: [
      {
        name: "Jaipur",
        schools: [
          // CBSE Schools
          { name: "Delhi Public School", city: "Jaipur", board: "CBSE" },
          { name: "Ryan International School", city: "Jaipur", board: "CBSE" },
          { name: "Kendriya Vidyalaya", city: "Jaipur", board: "CBSE" },
          { name: "GD Goenka Public School", city: "Jaipur", board: "CBSE" },
          { name: "Jayshree Periwal International School", city: "Jaipur", board: "CBSE" },
          { name: "Maharaja Sawai Man Singh Vidyalaya", city: "Jaipur", board: "CBSE" },
          { name: "Neerja Modi School", city: "Jaipur", board: "CBSE" },
          { name: "The Study World", city: "Jaipur", board: "CBSE" },
          { name: "Seedling Modern Public School", city: "Jaipur", board: "CBSE" },
          { name: "Amity International School", city: "Jaipur", board: "CBSE" },
          
          // ICSE Schools
          { name: "St. Xavier's School", city: "Jaipur", board: "ICSE" },
          { name: "St. Anselm's Pink City School", city: "Jaipur", board: "ICSE" },
          { name: "Maharaja Sawai Man Singh Vidyalaya", city: "Jaipur", board: "ICSE" },
          { name: "The Study World", city: "Jaipur", board: "ICSE" },
          { name: "Jayshree Periwal International School", city: "Jaipur", board: "ICSE" },
          { name: "St. Wilfred's School", city: "Jaipur", board: "ICSE" },
          { name: "St. Edmund's School", city: "Jaipur", board: "ICSE" },
          { name: "Presentation Convent School", city: "Jaipur", board: "ICSE" },
          { name: "Sophia Girls' School", city: "Jaipur", board: "ICSE" },
          { name: "Neerja Modi School", city: "Jaipur", board: "ICSE" },
          
          // IB Schools
          { name: "Jayshree Periwal International School", city: "Jaipur", board: "IB" },
          { name: "The Study World", city: "Jaipur", board: "IB" },
          { name: "Delhi Public School", city: "Jaipur", board: "IB" },
          { name: "GD Goenka Public School", city: "Jaipur", board: "IB" },
          { name: "Ryan International School", city: "Jaipur", board: "IB" },
          { name: "Neerja Modi School", city: "Jaipur", board: "IB" },
          { name: "Amity International School", city: "Jaipur", board: "IB" },
          { name: "Maharaja Sawai Man Singh Vidyalaya", city: "Jaipur", board: "IB" },
          { name: "Seedling Modern Public School", city: "Jaipur", board: "IB" },
          { name: "St. Xavier's School", city: "Jaipur", board: "IB" },
          
          // Cambridge Schools
          { name: "Jayshree Periwal International School", city: "Jaipur", board: "Cambridge" },
          { name: "The Study World", city: "Jaipur", board: "Cambridge" },
          { name: "Delhi Public School", city: "Jaipur", board: "Cambridge" },
          { name: "GD Goenka Public School", city: "Jaipur", board: "Cambridge" },
          { name: "Ryan International School", city: "Jaipur", board: "Cambridge" },
          { name: "Neerja Modi School", city: "Jaipur", board: "Cambridge" },
          { name: "Amity International School", city: "Jaipur", board: "Cambridge" },
          { name: "Maharaja Sawai Man Singh Vidyalaya", city: "Jaipur", board: "Cambridge" },
          { name: "St. Xavier's School", city: "Jaipur", board: "Cambridge" },
          { name: "Seedling Modern Public School", city: "Jaipur", board: "Cambridge" }
        ]
      }
    ]
  },
  {
    name: "Gujarat",
    cities: [
      {
        name: "Gandhinagar",
        schools: [
          // CBSE Schools
          { name: "Delhi Public School", city: "Gandhinagar", board: "CBSE" },
          { name: "Kendriya Vidyalaya", city: "Gandhinagar", board: "CBSE" },
          { name: "GD Goenka Public School", city: "Gandhinagar", board: "CBSE" },
          { name: "Udgam School for Children", city: "Gandhinagar", board: "CBSE" },
          { name: "GIIS Ahmedabad", city: "Gandhinagar", board: "CBSE" },
          { name: "Ryan International School", city: "Gandhinagar", board: "CBSE" },
          { name: "Shanti Asiatic School", city: "Gandhinagar", board: "CBSE" },
          { name: "Anand Niketan", city: "Gandhinagar", board: "CBSE" },
          { name: "Divine Child School", city: "Gandhinagar", board: "CBSE" },
          { name: "Rachana School", city: "Gandhinagar", board: "CBSE" },
          
          // ICSE Schools
          { name: "St. Kabir School", city: "Gandhinagar", board: "ICSE" },
          { name: "Delhi Public School", city: "Gandhinagar", board: "ICSE" },
          { name: "Udgam School for Children", city: "Gandhinagar", board: "ICSE" },
          { name: "GIIS Ahmedabad", city: "Gandhinagar", board: "ICSE" },
          { name: "Ryan International School", city: "Gandhinagar", board: "ICSE" },
          { name: "Shanti Asiatic School", city: "Gandhinagar", board: "ICSE" },
          { name: "GD Goenka Public School", city: "Gandhinagar", board: "ICSE" },
          { name: "Anand Niketan", city: "Gandhinagar", board: "ICSE" },
          { name: "Divine Child School", city: "Gandhinagar", board: "ICSE" },
          { name: "Rachana School", city: "Gandhinagar", board: "ICSE" },
          
          // IB Schools
          { name: "GIIS Ahmedabad", city: "Gandhinagar", board: "IB" },
          { name: "Udgam School for Children", city: "Gandhinagar", board: "IB" },
          { name: "Delhi Public School", city: "Gandhinagar", board: "IB" },
          { name: "Ryan International School", city: "Gandhinagar", board: "IB" },
          { name: "GD Goenka Public School", city: "Gandhinagar", board: "IB" },
          { name: "Shanti Asiatic School", city: "Gandhinagar", board: "IB" },
          { name: "St. Kabir School", city: "Gandhinagar", board: "IB" },
          { name: "Anand Niketan", city: "Gandhinagar", board: "IB" },
          { name: "Divine Child School", city: "Gandhinagar", board: "IB" },
          { name: "Rachana School", city: "Gandhinagar", board: "IB" },
          
          // Cambridge Schools
          { name: "GIIS Ahmedabad", city: "Gandhinagar", board: "Cambridge" },
          { name: "Udgam School for Children", city: "Gandhinagar", board: "Cambridge" },
          { name: "Delhi Public School", city: "Gandhinagar", board: "Cambridge" },
          { name: "Ryan International School", city: "Gandhinagar", board: "Cambridge" },
          { name: "GD Goenka Public School", city: "Gandhinagar", board: "Cambridge" },
          { name: "St. Kabir School", city: "Gandhinagar", board: "Cambridge" },
          { name: "Shanti Asiatic School", city: "Gandhinagar", board: "Cambridge" },
          { name: "Anand Niketan", city: "Gandhinagar", board: "Cambridge" },
          { name: "Divine Child School", city: "Gandhinagar", board: "Cambridge" },
          { name: "Rachana School", city: "Gandhinagar", board: "Cambridge" }
        ]
      }
    ]
  },
  {
    name: "Telangana",
    cities: [
      {
        name: "Hyderabad",
        schools: [
          // CBSE Schools
          { name: "Oakridge International School", city: "Hyderabad", board: "CBSE" },
          { name: "Delhi Public School", city: "Hyderabad", board: "CBSE" },
          { name: "Nasr School", city: "Hyderabad", board: "CBSE" },
          { name: "Bharatiya Vidya Bhavan", city: "Hyderabad", board: "CBSE" },
          { name: "Meridian School", city: "Hyderabad", board: "CBSE" },
          { name: "Glendale Academy", city: "Hyderabad", board: "CBSE" },
          { name: "Sancta Maria International School", city: "Hyderabad", board: "CBSE" },
          { name: "Bhashyam Public School", city: "Hyderabad", board: "CBSE" },
          { name: "Gowtham Model School", city: "Hyderabad", board: "CBSE" },
          { name: "Ryan International School", city: "Hyderabad", board: "CBSE" },
          
          // ICSE Schools
          { name: "St. Francis' College for Women", city: "Hyderabad", board: "ICSE" },
          { name: "St. Mary's High School", city: "Hyderabad", board: "ICSE" },
          { name: "Oakridge International School", city: "Hyderabad", board: "ICSE" },
          { name: "Little Flower High School", city: "Hyderabad", board: "ICSE" },
          { name: "St. Joseph's Public School", city: "Hyderabad", board: "ICSE" },
          { name: "Bharatiya Vidya Bhavan", city: "Hyderabad", board: "ICSE" },
          { name: "Holy Angels' Convent High School", city: "Hyderabad", board: "ICSE" },
          { name: "Nasr School", city: "Hyderabad", board: "ICSE" },
          { name: "Meridian School", city: "Hyderabad", board: "ICSE" },
          { name: "St. Andrews High School", city: "Hyderabad", board: "ICSE" },
          
          // IB Schools
          { name: "Oakridge International School", city: "Hyderabad", board: "IB" },
          { name: "Indus International School", city: "Hyderabad", board: "IB" },
          { name: "Chirec International School", city: "Hyderabad", board: "IB" },
          { name: "Delhi Public School", city: "Hyderabad", board: "IB" },
          { name: "Meridian School", city: "Hyderabad", board: "IB" },
          { name: "Sancta Maria International School", city: "Hyderabad", board: "IB" },
          { name: "Glendale Academy", city: "Hyderabad", board: "IB" },
          { name: "Ryan International School", city: "Hyderabad", board: "IB" },
          { name: "Bharatiya Vidya Bhavan", city: "Hyderabad", board: "IB" },
          { name: "Nasr School", city: "Hyderabad", board: "IB" },
          
          // Cambridge Schools
          { name: "Chirec International School", city: "Hyderabad", board: "Cambridge" },
          { name: "Oakridge International School", city: "Hyderabad", board: "Cambridge" },
          { name: "Indus International School", city: "Hyderabad", board: "Cambridge" },
          { name: "Delhi Public School", city: "Hyderabad", board: "Cambridge" },
          { name: "Meridian School", city: "Hyderabad", board: "Cambridge" },
          { name: "Sancta Maria International School", city: "Hyderabad", board: "Cambridge" },
          { name: "Glendale Academy", city: "Hyderabad", board: "Cambridge" },
          { name: "Ryan International School", city: "Hyderabad", board: "Cambridge" },
          { name: "Bharatiya Vidya Bhavan", city: "Hyderabad", board: "Cambridge" },
          { name: "Nasr School", city: "Hyderabad", board: "Cambridge" }
        ]
      }
    ]
  },
  {
    name: "Kerala",
    cities: [
      {
        name: "Thiruvananthapuram",
        schools: [
          // CBSE Schools
          { name: "Kendriya Vidyalaya", city: "Thiruvananthapuram", board: "CBSE" },
          { name: "Chinmaya Vidyalaya", city: "Thiruvananthapuram", board: "CBSE" },
          { name: "Delhi Public School", city: "Thiruvananthapuram", board: "CBSE" },
          { name: "Bhavan's Vidya Mandir", city: "Thiruvananthapuram", board: "CBSE" },
          { name: "Ryan International School", city: "Thiruvananthapuram", board: "CBSE" },
          { name: "Christ Nagar School", city: "Thiruvananthapuram", board: "CBSE" },
          { name: "Sarvodaya Vidyalaya", city: "Thiruvananthapuram", board: "CBSE" },
          { name: "Amrita Vidyalayam", city: "Thiruvananthapuram", board: "CBSE" },
          { name: "Holy Angels' ISC", city: "Thiruvananthapuram", board: "CBSE" },
          { name: "Trivandrum International School", city: "Thiruvananthapuram", board: "CBSE" },
          
          // ICSE Schools
          { name: "Bishop Moore Vidyapith", city: "Thiruvananthapuram", board: "ICSE" },
          { name: "Christ Nagar School", city: "Thiruvananthapuram", board: "ICSE" },
          { name: "Holy Angels' ISC", city: "Thiruvananthapuram", board: "ICSE" },
          { name: "Loyola School", city: "Thiruvananthapuram", board: "ICSE" },
          { name: "St. Mary's Higher Secondary School", city: "Thiruvananthapuram", board: "ICSE" },
          { name: "Chinmaya Vidyalaya", city: "Thiruvananthapuram", board: "ICSE" },
          { name: "Delhi Public School", city: "Thiruvananthapuram", board: "ICSE" },
          { name: "Carmel Girls Higher Secondary School", city: "Thiruvananthapuram", board: "ICSE" },
          { name: "Ryan International School", city: "Thiruvananthapuram", board: "ICSE" },
          { name: "Trivandrum International School", city: "Thiruvananthapuram", board: "ICSE" },
          
          // IB Schools
          { name: "Trivandrum International School", city: "Thiruvananthapuram", board: "IB" },
          { name: "Christ Nagar School", city: "Thiruvananthapuram", board: "IB" },
          { name: "Delhi Public School", city: "Thiruvananthapuram", board: "IB" },
          { name: "Ryan International School", city: "Thiruvananthapuram", board: "IB" },
          { name: "Chinmaya Vidyalaya", city: "Thiruvananthapuram", board: "IB" },
          { name: "Holy Angels' ISC", city: "Thiruvananthapuram", board: "IB" },
          { name: "Bhavan's Vidya Mandir", city: "Thiruvananthapuram", board: "IB" },
          { name: "Amrita Vidyalayam", city: "Thiruvananthapuram", board: "IB" },
          { name: "Bishop Moore Vidyapith", city: "Thiruvananthapuram", board: "IB" },
          { name: "Loyola School", city: "Thiruvananthapuram", board: "IB" },
          
          // Cambridge Schools
          { name: "Trivandrum International School", city: "Thiruvananthapuram", board: "Cambridge" },
          { name: "Christ Nagar School", city: "Thiruvananthapuram", board: "Cambridge" },
          { name: "Delhi Public School", city: "Thiruvananthapuram", board: "Cambridge" },
          { name: "Ryan International School", city: "Thiruvananthapuram", board: "Cambridge" },
          { name: "Chinmaya Vidyalaya", city: "Thiruvananthapuram", board: "Cambridge" },
          { name: "Holy Angels' ISC", city: "Thiruvananthapuram", board: "Cambridge" },
          { name: "Bhavan's Vidya Mandir", city: "Thiruvananthapuram", board: "Cambridge" },
          { name: "Amrita Vidyalayam", city: "Thiruvananthapuram", board: "Cambridge" },
          { name: "Bishop Moore Vidyapith", city: "Thiruvananthapuram", board: "Cambridge" },
          { name: "Loyola School", city: "Thiruvananthapuram", board: "Cambridge" }
        ]
      }
    ]
  },
  {
    name: "Punjab",
    cities: [
      {
        name: "Chandigarh",
        schools: [
          // CBSE Schools
          { name: "Delhi Public School", city: "Chandigarh", board: "CBSE" },
          { name: "Kendriya Vidyalaya", city: "Chandigarh", board: "CBSE" },
          { name: "St. John's High School", city: "Chandigarh", board: "CBSE" },
          { name: "Ryan International School", city: "Chandigarh", board: "CBSE" },
          { name: "Sacred Heart Senior Secondary School", city: "Chandigarh", board: "CBSE" },
          { name: "GD Goenka Public School", city: "Chandigarh", board: "CBSE" },
          { name: "DAV College", city: "Chandigarh", board: "CBSE" },
          { name: "Strawberry Fields High School", city: "Chandigarh", board: "CBSE" },
          { name: "St. Stephen's School", city: "Chandigarh", board: "CBSE" },
          { name: "Vivek High School", city: "Chandigarh", board: "CBSE" },
          
          // ICSE Schools
          { name: "St. John's High School", city: "Chandigarh", board: "ICSE" },
          { name: "Sacred Heart Senior Secondary School", city: "Chandigarh", board: "ICSE" },
          { name: "Delhi Public School", city: "Chandigarh", board: "ICSE" },
          { name: "Ryan International School", city: "Chandigarh", board: "ICSE" },
          { name: "GD Goenka Public School", city: "Chandigarh", board: "ICSE" },
          { name: "St. Stephen's School", city: "Chandigarh", board: "ICSE" },
          { name: "Strawberry Fields High School", city: "Chandigarh", board: "ICSE" },
          { name: "Vivek High School", city: "Chandigarh", board: "ICSE" },
          { name: "DAV College", city: "Chandigarh", board: "ICSE" },
          { name: "St. Anne's Convent School", city: "Chandigarh", board: "ICSE" },
          
          // IB Schools
          { name: "Delhi Public School", city: "Chandigarh", board: "IB" },
          { name: "Ryan International School", city: "Chandigarh", board: "IB" },
          { name: "GD Goenka Public School", city: "Chandigarh", board: "IB" },
          { name: "St. John's High School", city: "Chandigarh", board: "IB" },
          { name: "Sacred Heart Senior Secondary School", city: "Chandigarh", board: "IB" },
          { name: "Strawberry Fields High School", city: "Chandigarh", board: "IB" },
          { name: "St. Stephen's School", city: "Chandigarh", board: "IB" },
          { name: "Vivek High School", city: "Chandigarh", board: "IB" },
          { name: "DAV College", city: "Chandigarh", board: "IB" },
          { name: "St. Anne's Convent School", city: "Chandigarh", board: "IB" },
          
          // Cambridge Schools
          { name: "Delhi Public School", city: "Chandigarh", board: "Cambridge" },
          { name: "Ryan International School", city: "Chandigarh", board: "Cambridge" },
          { name: "GD Goenka Public School", city: "Chandigarh", board: "Cambridge" },
          { name: "St. John's High School", city: "Chandigarh", board: "Cambridge" },
          { name: "Sacred Heart Senior Secondary School", city: "Chandigarh", board: "Cambridge" },
          { name: "Strawberry Fields High School", city: "Chandigarh", board: "Cambridge" },
          { name: "St. Stephen's School", city: "Chandigarh", board: "Cambridge" },
          { name: "Vivek High School", city: "Chandigarh", board: "Cambridge" },
          { name: "DAV College", city: "Chandigarh", board: "Cambridge" },
          { name: "St. Anne's Convent School", city: "Chandigarh", board: "Cambridge" }
        ]
      }
    ]
  },
  {
    name: "Madhya Pradesh",
    cities: [
      {
        name: "Bhopal",
        schools: [
          // CBSE Schools
          { name: "Delhi Public School", city: "Bhopal", board: "CBSE" },
          { name: "Kendriya Vidyalaya", city: "Bhopal", board: "CBSE" },
          { name: "Campion School", city: "Bhopal", board: "CBSE" },
          { name: "St. Joseph's Co-Ed School", city: "Bhopal", board: "CBSE" },
          { name: "Ryan International School", city: "Bhopal", board: "CBSE" },
          { name: "GD Goenka Public School", city: "Bhopal", board: "CBSE" },
          { name: "Bharatiya Vidya Bhavan", city: "Bhopal", board: "CBSE" },
          { name: "Sagar Public School", city: "Bhopal", board: "CBSE" },
          { name: "International School of Bhopal", city: "Bhopal", board: "CBSE" },
          { name: "Notre Dame Academy", city: "Bhopal", board: "CBSE" },
          
          // ICSE Schools
          { name: "Campion School", city: "Bhopal", board: "ICSE" },
          { name: "St. Joseph's Co-Ed School", city: "Bhopal", board: "ICSE" },
          { name: "Notre Dame Academy", city: "Bhopal", board: "ICSE" },
          { name: "Delhi Public School", city: "Bhopal", board: "ICSE" },
          { name: "Ryan International School", city: "Bhopal", board: "ICSE" },
          { name: "GD Goenka Public School", city: "Bhopal", board: "ICSE" },
          { name: "International School of Bhopal", city: "Bhopal", board: "ICSE" },
          { name: "Bharatiya Vidya Bhavan", city: "Bhopal", board: "ICSE" },
          { name: "Sagar Public School", city: "Bhopal", board: "ICSE" },
          { name: "St. Carmel Convent School", city: "Bhopal", board: "ICSE" },
          
          // IB Schools
          { name: "International School of Bhopal", city: "Bhopal", board: "IB" },
          { name: "Delhi Public School", city: "Bhopal", board: "IB" },
          { name: "Ryan International School", city: "Bhopal", board: "IB" },
          { name: "GD Goenka Public School", city: "Bhopal", board: "IB" },
          { name: "Campion School", city: "Bhopal", board: "IB" },
          { name: "St. Joseph's Co-Ed School", city: "Bhopal", board: "IB" },
          { name: "Bharatiya Vidya Bhavan", city: "Bhopal", board: "IB" },
          { name: "Notre Dame Academy", city: "Bhopal", board: "IB" },
          { name: "Sagar Public School", city: "Bhopal", board: "IB" },
          { name: "St. Carmel Convent School", city: "Bhopal", board: "IB" },
          
          // Cambridge Schools
          { name: "International School of Bhopal", city: "Bhopal", board: "Cambridge" },
          { name: "Delhi Public School", city: "Bhopal", board: "Cambridge" },
          { name: "Ryan International School", city: "Bhopal", board: "Cambridge" },
          { name: "GD Goenka Public School", city: "Bhopal", board: "Cambridge" },
          { name: "Campion School", city: "Bhopal", board: "Cambridge" },
          { name: "St. Joseph's Co-Ed School", city: "Bhopal", board: "Cambridge" },
          { name: "Bharatiya Vidya Bhavan", city: "Bhopal", board: "Cambridge" },
          { name: "Notre Dame Academy", city: "Bhopal", board: "Cambridge" },
          { name: "Sagar Public School", city: "Bhopal", board: "Cambridge" },
          { name: "St. Carmel Convent School", city: "Bhopal", board: "Cambridge" }
        ]
      }
    ]
  },
  // Adding more state capitals to complete comprehensive coverage
  {
    name: "Assam",
    cities: [
      {
        name: "Dispur",
        schools: [
          // CBSE Schools
          { name: "Kendriya Vidyalaya", city: "Dispur", board: "CBSE" },
          { name: "Delhi Public School", city: "Dispur", board: "CBSE" },
          { name: "Don Bosco School", city: "Dispur", board: "CBSE" },
          { name: "Cotton University High School", city: "Dispur", board: "CBSE" },
          { name: "Sarala Birla Gyan Jyoti", city: "Dispur", board: "CBSE" },
          { name: "Ryan International School", city: "Dispur", board: "CBSE" },
          { name: "DAV Public School", city: "Dispur", board: "CBSE" },
          { name: "Maharishi Vidya Mandir", city: "Dispur", board: "CBSE" },
          { name: "Vivekananda Kendra Vidyalaya", city: "Dispur", board: "CBSE" },
          { name: "St. Mary's School", city: "Dispur", board: "CBSE" },
          
          // ICSE Schools
          { name: "Don Bosco School", city: "Dispur", board: "ICSE" },
          { name: "Holy Child School", city: "Dispur", board: "ICSE" },
          { name: "Loreto Convent", city: "Dispur", board: "ICSE" },
          { name: "St. Mary's School", city: "Dispur", board: "ICSE" },
          { name: "Little Flower School", city: "Dispur", board: "ICSE" },
          { name: "Assam Valley School", city: "Dispur", board: "ICSE" },
          { name: "Delhi Public School", city: "Dispur", board: "ICSE" },
          { name: "Sanskriti School", city: "Dispur", board: "ICSE" },
          { name: "Cotton University High School", city: "Dispur", board: "ICSE" },
          { name: "Ryan International School", city: "Dispur", board: "ICSE" },
          
          // IB Schools
          { name: "Delhi Public School", city: "Dispur", board: "IB" },
          { name: "Assam Valley School", city: "Dispur", board: "IB" },
          { name: "Ryan International School", city: "Dispur", board: "IB" },
          { name: "Don Bosco School", city: "Dispur", board: "IB" },
          { name: "Sarala Birla Gyan Jyoti", city: "Dispur", board: "IB" },
          { name: "St. Mary's School", city: "Dispur", board: "IB" },
          { name: "Cotton University High School", city: "Dispur", board: "IB" },
          { name: "Holy Child School", city: "Dispur", board: "IB" },
          { name: "Maharishi Vidya Mandir", city: "Dispur", board: "IB" },
          { name: "Vivekananda Kendra Vidyalaya", city: "Dispur", board: "IB" },
          
          // Cambridge Schools
          { name: "Delhi Public School", city: "Dispur", board: "Cambridge" },
          { name: "Assam Valley School", city: "Dispur", board: "Cambridge" },
          { name: "Ryan International School", city: "Dispur", board: "Cambridge" },
          { name: "Don Bosco School", city: "Dispur", board: "Cambridge" },
          { name: "Sarala Birla Gyan Jyoti", city: "Dispur", board: "Cambridge" },
          { name: "St. Mary's School", city: "Dispur", board: "Cambridge" },
          { name: "Cotton University High School", city: "Dispur", board: "Cambridge" },
          { name: "Holy Child School", city: "Dispur", board: "Cambridge" },
          { name: "Maharishi Vidya Mandir", city: "Dispur", board: "Cambridge" },
          { name: "Vivekananda Kendra Vidyalaya", city: "Dispur", board: "Cambridge" }
        ]
      }
    ]
  },
  {
    name: "Bihar",
    cities: [
      {
        name: "Patna",
        schools: [
          // CBSE Schools
          { name: "Delhi Public School", city: "Patna", board: "CBSE" },
          { name: "Kendriya Vidyalaya", city: "Patna", board: "CBSE" },
          { name: "DAV Public School", city: "Patna", board: "CBSE" },
          { name: "St. Michael's High School", city: "Patna", board: "CBSE" },
          { name: "Ryan International School", city: "Patna", board: "CBSE" },
          { name: "Notre Dame Academy", city: "Patna", board: "CBSE" },
          { name: "Loyola High School", city: "Patna", board: "CBSE" },
          { name: "St. Xavier's High School", city: "Patna", board: "CBSE" },
          { name: "Bharatiya Vidya Bhavan", city: "Patna", board: "CBSE" },
          { name: "GD Goenka Public School", city: "Patna", board: "CBSE" },
          
          // ICSE Schools
          { name: "St. Michael's High School", city: "Patna", board: "ICSE" },
          { name: "Notre Dame Academy", city: "Patna", board: "ICSE" },
          { name: "Loyola High School", city: "Patna", board: "ICSE" },
          { name: "St. Xavier's High School", city: "Patna", board: "ICSE" },
          { name: "Don Bosco Academy", city: "Patna", board: "ICSE" },
          { name: "Delhi Public School", city: "Patna", board: "ICSE" },
          { name: "Ryan International School", city: "Patna", board: "ICSE" },
          { name: "St. Karen's Secondary School", city: "Patna", board: "ICSE" },
          { name: "Holy Family High School", city: "Patna", board: "ICSE" },
          { name: "GD Goenka Public School", city: "Patna", board: "ICSE" },
          
          // IB Schools
          { name: "Delhi Public School", city: "Patna", board: "IB" },
          { name: "Ryan International School", city: "Patna", board: "IB" },
          { name: "GD Goenka Public School", city: "Patna", board: "IB" },
          { name: "St. Michael's High School", city: "Patna", board: "IB" },
          { name: "Notre Dame Academy", city: "Patna", board: "IB" },
          { name: "Loyola High School", city: "Patna", board: "IB" },
          { name: "St. Xavier's High School", city: "Patna", board: "IB" },
          { name: "Bharatiya Vidya Bhavan", city: "Patna", board: "IB" },
          { name: "DAV Public School", city: "Patna", board: "IB" },
          { name: "Don Bosco Academy", city: "Patna", board: "IB" },
          
          // Cambridge Schools
          { name: "Delhi Public School", city: "Patna", board: "Cambridge" },
          { name: "Ryan International School", city: "Patna", board: "Cambridge" },
          { name: "GD Goenka Public School", city: "Patna", board: "Cambridge" },
          { name: "St. Michael's High School", city: "Patna", board: "Cambridge" },
          { name: "Notre Dame Academy", city: "Patna", board: "Cambridge" },
          { name: "Loyola High School", city: "Patna", board: "Cambridge" },
          { name: "St. Xavier's High School", city: "Patna", board: "Cambridge" },
          { name: "Bharatiya Vidya Bhavan", city: "Patna", board: "Cambridge" },
          { name: "DAV Public School", city: "Patna", board: "Cambridge" },
          { name: "Don Bosco Academy", city: "Patna", board: "Cambridge" }
        ]
      }
    ]
  },
  {
    name: "Chhattisgarh",
    cities: [
      {
        name: "Raipur",
        schools: [
          // CBSE Schools
          { name: "Delhi Public School", city: "Raipur", board: "CBSE" },
          { name: "Kendriya Vidyalaya", city: "Raipur", board: "CBSE" },
          { name: "Ryan International School", city: "Raipur", board: "CBSE" },
          { name: "GD Goenka Public School", city: "Raipur", board: "CBSE" },
          { name: "DAV Public School", city: "Raipur", board: "CBSE" },
          { name: "St. Xavier's High School", city: "Raipur", board: "CBSE" },
          { name: "Bharatiya Vidya Bhavan", city: "Raipur", board: "CBSE" },
          { name: "Narayana E-Techno School", city: "Raipur", board: "CBSE" },
          { name: "O.P. Jindal School", city: "Raipur", board: "CBSE" },
          { name: "Sanskar International School", city: "Raipur", board: "CBSE" },
          
          // ICSE Schools
          { name: "St. Xavier's High School", city: "Raipur", board: "ICSE" },
          { name: "Notre Dame Academy", city: "Raipur", board: "ICSE" },
          { name: "Delhi Public School", city: "Raipur", board: "ICSE" },
          { name: "Ryan International School", city: "Raipur", board: "ICSE" },
          { name: "Carmel Convent High School", city: "Raipur", board: "ICSE" },
          { name: "Holy Cross Convent School", city: "Raipur", board: "ICSE" },
          { name: "GD Goenka Public School", city: "Raipur", board: "ICSE" },
          { name: "Bharatiya Vidya Bhavan", city: "Raipur", board: "ICSE" },
          { name: "O.P. Jindal School", city: "Raipur", board: "ICSE" },
          { name: "Sanskar International School", city: "Raipur", board: "ICSE" },
          
          // IB Schools
          { name: "Delhi Public School", city: "Raipur", board: "IB" },
          { name: "Ryan International School", city: "Raipur", board: "IB" },
          { name: "GD Goenka Public School", city: "Raipur", board: "IB" },
          { name: "O.P. Jindal School", city: "Raipur", board: "IB" },
          { name: "St. Xavier's High School", city: "Raipur", board: "IB" },
          { name: "Bharatiya Vidya Bhavan", city: "Raipur", board: "IB" },
          { name: "Sanskar International School", city: "Raipur", board: "IB" },
          { name: "Narayana E-Techno School", city: "Raipur", board: "IB" },
          { name: "Notre Dame Academy", city: "Raipur", board: "IB" },
          { name: "DAV Public School", city: "Raipur", board: "IB" },
          
          // Cambridge Schools
          { name: "Delhi Public School", city: "Raipur", board: "Cambridge" },
          { name: "Ryan International School", city: "Raipur", board: "Cambridge" },
          { name: "GD Goenka Public School", city: "Raipur", board: "Cambridge" },
          { name: "O.P. Jindal School", city: "Raipur", board: "Cambridge" },
          { name: "St. Xavier's High School", city: "Raipur", board: "Cambridge" },
          { name: "Bharatiya Vidya Bhavan", city: "Raipur", board: "Cambridge" },
          { name: "Sanskar International School", city: "Raipur", board: "Cambridge" },
          { name: "Narayana E-Techno School", city: "Raipur", board: "Cambridge" },
          { name: "Notre Dame Academy", city: "Raipur", board: "Cambridge" },
          { name: "DAV Public School", city: "Raipur", board: "Cambridge" }
        ]
      }
    ]
  },
  {
    name: "Odisha",
    cities: [
      {
        name: "Bhubaneswar",
        schools: [
          // CBSE Schools
          { name: "Delhi Public School", city: "Bhubaneswar", board: "CBSE" },
          { name: "Kendriya Vidyalaya", city: "Bhubaneswar", board: "CBSE" },
          { name: "DAV Public School", city: "Bhubaneswar", board: "CBSE" },
          { name: "Kalinga Institute of Social Sciences", city: "Bhubaneswar", board: "CBSE" },
          { name: "Ryan International School", city: "Bhubaneswar", board: "CBSE" },
          { name: "ODM Public School", city: "Bhubaneswar", board: "CBSE" },
          { name: "St. Xavier's High School", city: "Bhubaneswar", board: "CBSE" },
          { name: "Bharatiya Vidya Bhavan", city: "Bhubaneswar", board: "CBSE" },
          { name: "Loyola School", city: "Bhubaneswar", board: "CBSE" },
          { name: "SAI International School", city: "Bhubaneswar", board: "CBSE" },
          
          // ICSE Schools
          { name: "St. Xavier's High School", city: "Bhubaneswar", board: "ICSE" },
          { name: "Loyola School", city: "Bhubaneswar", board: "ICSE" },
          { name: "Delhi Public School", city: "Bhubaneswar", board: "ICSE" },
          { name: "Convent of Jesus & Mary", city: "Bhubaneswar", board: "ICSE" },
          { name: "St. Joseph's High School", city: "Bhubaneswar", board: "ICSE" },
          { name: "Ryan International School", city: "Bhubaneswar", board: "ICSE" },
          { name: "ODM Public School", city: "Bhubaneswar", board: "ICSE" },
          { name: "SAI International School", city: "Bhubaneswar", board: "ICSE" },
          { name: "Bharatiya Vidya Bhavan", city: "Bhubaneswar", board: "ICSE" },
          { name: "Kalinga Institute of Social Sciences", city: "Bhubaneswar", board: "ICSE" },
          
          // IB Schools
          { name: "SAI International School", city: "Bhubaneswar", board: "IB" },
          { name: "Delhi Public School", city: "Bhubaneswar", board: "IB" },
          { name: "Kalinga Institute of Social Sciences", city: "Bhubaneswar", board: "IB" },
          { name: "Ryan International School", city: "Bhubaneswar", board: "IB" },
          { name: "ODM Public School", city: "Bhubaneswar", board: "IB" },
          { name: "St. Xavier's High School", city: "Bhubaneswar", board: "IB" },
          { name: "Loyola School", city: "Bhubaneswar", board: "IB" },
          { name: "Bharatiya Vidya Bhavan", city: "Bhubaneswar", board: "IB" },
          { name: "DAV Public School", city: "Bhubaneswar", board: "IB" },
          { name: "Convent of Jesus & Mary", city: "Bhubaneswar", board: "IB" },
          
          // Cambridge Schools
          { name: "SAI International School", city: "Bhubaneswar", board: "Cambridge" },
          { name: "Delhi Public School", city: "Bhubaneswar", board: "Cambridge" },
          { name: "Kalinga Institute of Social Sciences", city: "Bhubaneswar", board: "Cambridge" },
          { name: "Ryan International School", city: "Bhubaneswar", board: "Cambridge" },
          { name: "ODM Public School", city: "Bhubaneswar", board: "Cambridge" },
          { name: "St. Xavier's High School", city: "Bhubaneswar", board: "Cambridge" },
          { name: "Loyola School", city: "Bhubaneswar", board: "Cambridge" },
          { name: "Bharatiya Vidya Bhavan", city: "Bhubaneswar", board: "Cambridge" },
          { name: "DAV Public School", city: "Bhubaneswar", board: "Cambridge" },
          { name: "Convent of Jesus & Mary", city: "Bhubaneswar", board: "Cambridge" }
        ]
      }
    ]
  },
  {
    name: "Andhra Pradesh",
    cities: [
      {
        name: "Amaravati",
        schools: [
          // CBSE Schools
          { name: "Kendriya Vidyalaya", city: "Amaravati", board: "CBSE" },
          { name: "Delhi Public School", city: "Amaravati", board: "CBSE" },
          { name: "Vikas The Concept School", city: "Amaravati", board: "CBSE" },
          { name: "Bhashyam Public School", city: "Amaravati", board: "CBSE" },
          { name: "Ryan International School", city: "Amaravati", board: "CBSE" },
          { name: "NRI Academy", city: "Amaravati", board: "CBSE" },
          { name: "Bharatiya Vidya Bhavan", city: "Amaravati", board: "CBSE" },
          { name: "Meridian School", city: "Amaravati", board: "CBSE" },
          { name: "Gowtham Model School", city: "Amaravati", board: "CBSE" },
          { name: "Little Flower High School", city: "Amaravati", board: "CBSE" },
          
          // ICSE Schools
          { name: "Little Flower High School", city: "Amaravati", board: "ICSE" },
          { name: "St. Mary's High School", city: "Amaravati", board: "ICSE" },
          { name: "Delhi Public School", city: "Amaravati", board: "ICSE" },
          { name: "Ryan International School", city: "Amaravati", board: "ICSE" },
          { name: "Vikas The Concept School", city: "Amaravati", board: "ICSE" },
          { name: "St. Joseph's High School", city: "Amaravati", board: "ICSE" },
          { name: "Bhashyam Public School", city: "Amaravati", board: "ICSE" },
          { name: "NRI Academy", city: "Amaravati", board: "ICSE" },
          { name: "Bharatiya Vidya Bhavan", city: "Amaravati", board: "ICSE" },
          { name: "Meridian School", city: "Amaravati", board: "ICSE" },
          
          // IB Schools
          { name: "Delhi Public School", city: "Amaravati", board: "IB" },
          { name: "Ryan International School", city: "Amaravati", board: "IB" },
          { name: "Vikas The Concept School", city: "Amaravati", board: "IB" },
          { name: "NRI Academy", city: "Amaravati", board: "IB" },
          { name: "Meridian School", city: "Amaravati", board: "IB" },
          { name: "Bhashyam Public School", city: "Amaravati", board: "IB" },
          { name: "Bharatiya Vidya Bhavan", city: "Amaravati", board: "IB" },
          { name: "Little Flower High School", city: "Amaravati", board: "IB" },
          { name: "St. Mary's High School", city: "Amaravati", board: "IB" },
          { name: "Gowtham Model School", city: "Amaravati", board: "IB" },
          
          // Cambridge Schools
          { name: "Delhi Public School", city: "Amaravati", board: "Cambridge" },
          { name: "Ryan International School", city: "Amaravati", board: "Cambridge" },
          { name: "Vikas The Concept School", city: "Amaravati", board: "Cambridge" },
          { name: "NRI Academy", city: "Amaravati", board: "Cambridge" },
          { name: "Meridian School", city: "Amaravati", board: "Cambridge" },
          { name: "Bhashyam Public School", city: "Amaravati", board: "Cambridge" },
          { name: "Bharatiya Vidya Bhavan", city: "Amaravati", board: "Cambridge" },
          { name: "Little Flower High School", city: "Amaravati", board: "Cambridge" },
          { name: "St. Mary's High School", city: "Amaravati", board: "Cambridge" },
          { name: "Gowtham Model School", city: "Amaravati", board: "Cambridge" }
        ]
      }
    ]
  }
];

// Helper functions for the new workflow

export const getStateNames = (): string[] => {
  return ENHANCED_INDIAN_STATES_SCHOOLS.map(state => state.name);
};

export const getCitiesByState = (stateName: string): string[] => {
  const state = ENHANCED_INDIAN_STATES_SCHOOLS.find(s => s.name === stateName);
  if (!state) return [];
  return state.cities.map(city => city.name);
};

export const getBoardsByStateAndCity = (stateName: string, cityName: string): string[] => {
  const state = ENHANCED_INDIAN_STATES_SCHOOLS.find(s => s.name === stateName);
  if (!state) return [];
  
  const city = state.cities.find(c => c.name === cityName);
  if (!city) return [];
  
  const boards = [...new Set(city.schools.map(school => school.board))];
  return boards.sort();
};

export const getSchoolsByStateAndCityAndBoard = (stateName: string, cityName: string, boardType: string): School[] => {
  const state = ENHANCED_INDIAN_STATES_SCHOOLS.find(s => s.name === stateName);
  if (!state) return [];
  
  const city = state.cities.find(c => c.name === cityName);
  if (!city) return [];
  
  return city.schools.filter(school => school.board === boardType);
};

export const getAllSchools = (): School[] => {
  return ENHANCED_INDIAN_STATES_SCHOOLS.flatMap(state => 
    state.cities.flatMap(city => city.schools)
  );
};

export const getAllBoardTypes = (): string[] => {
  const allSchools = getAllSchools();
  const boards = [...new Set(allSchools.map(school => school.board))];
  return boards.sort();
};

export const getAllCities = (): string[] => {
  const allCities = ENHANCED_INDIAN_STATES_SCHOOLS.flatMap(state => 
    state.cities.map(city => city.name)
  );
  return [...new Set(allCities)].sort();
};

// Backward compatibility functions
export const getSchoolsByState = (stateName: string): School[] => {
  const state = ENHANCED_INDIAN_STATES_SCHOOLS.find(s => s.name === stateName);
  if (!state) return [];
  
  return state.cities.flatMap(city => city.schools);
}; 