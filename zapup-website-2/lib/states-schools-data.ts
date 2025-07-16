// Website/zapup-website-2/lib/states-schools-data.ts
// States and Schools Data for India with enhanced city and board support
// Top 10 schools for each state in India organized by cities and board types

export interface School {
  name: string;
  city: string;
  board: string;
}

export interface StateData {
  name: string;
  schools: School[];
}

export const INDIAN_STATES_SCHOOLS: StateData[] = [
  {
    name: "Andhra Pradesh",
    schools: [
      { name: "Oakridge International School", city: "Hyderabad", board: "IB" },
      { name: "Indus International School", city: "Hyderabad", board: "IB" },
      { name: "Bharatiya Vidya Bhavan", city: "Hyderabad", board: "CBSE" },
      { name: "Nasr School", city: "Hyderabad", board: "CBSE" },
      { name: "Meridian School", city: "Hyderabad", board: "CBSE" },
      { name: "Chirec International School", city: "Hyderabad", board: "Cambridge" },
      { name: "Glendale Academy", city: "Hyderabad", board: "CBSE" },
      { name: "Sancta Maria International School", city: "Hyderabad", board: "CBSE" },
      { name: "Bhashyam Public School", city: "Hyderabad", board: "CBSE" },
      { name: "Gowtham Model School", city: "Hyderabad", board: "CBSE" }
    ]
  },
  {
    name: "Assam",
    schools: [
      { name: "Don Bosco School", city: "Guwahati", board: "CBSE" },
      { name: "Kendriya Vidyalaya", city: "Guwahati", board: "CBSE" },
      { name: "Delhi Public School", city: "Guwahati", board: "CBSE" },
      { name: "Carmel High School", city: "Guwahati", board: "CBSE" },
      { name: "Jawahar Navodaya Vidyalaya", city: "Guwahati", board: "CBSE" },
      { name: "St. Mary's School", city: "Guwahati", board: "CBSE" },
      { name: "Sanskriti The Gurukul", city: "Guwahati", board: "CBSE" },
      { name: "Army Public School", city: "Guwahati", board: "CBSE" },
      { name: "Maharishi Vidya Mandir", city: "Guwahati", board: "CBSE" },
      { name: "Little Flower School", city: "Guwahati", board: "CBSE" }
    ]
  },
  {
    name: "Bihar",
    schools: [
      { name: "Delhi Public School", city: "Patna", board: "CBSE" },
      { name: "Kendriya Vidyalaya", city: "Patna", board: "CBSE" },
      { name: "DAV Public School", city: "Patna", board: "CBSE" },
      { name: "St. Karen's Secondary School", city: "Patna", board: "CBSE" },
      { name: "Notre Dame Academy", city: "Patna", board: "CBSE" },
      { name: "Jawahar Navodaya Vidyalaya", city: "Patna", board: "CBSE" },
      { name: "Army Public School", city: "Patna", board: "CBSE" },
      { name: "Loyola High School", city: "Patna", board: "CBSE" },
      { name: "St. Xavier's High School", city: "Patna", board: "CBSE" },
      { name: "Simultala Awasiya Vidyalaya", city: "Jamui", board: "CBSE" }
    ]
  },
  {
    name: "Chhattisgarh",
    schools: [
      { name: "Delhi Public School", city: "Raipur", board: "CBSE" },
      { name: "Kendriya Vidyalaya", city: "Raipur", board: "CBSE" },
      { name: "DAV Public School", city: "Raipur", board: "CBSE" },
      { name: "St. Xavier's School", city: "Raipur", board: "CBSE" },
      { name: "Jawahar Navodaya Vidyalaya", city: "Raipur", board: "CBSE" },
      { name: "Army Public School", city: "Raipur", board: "CBSE" },
      { name: "Carmel Convent School", city: "Raipur", board: "CBSE" },
      { name: "Rungta Public School", city: "Raipur", board: "CBSE" },
      { name: "Bhilai Public School", city: "Bhilai", board: "CBSE" },
      { name: "Narbada Public School", city: "Raipur", board: "CBSE" }
    ]
  },
  {
    name: "Delhi",
    schools: [
      { name: "Delhi Public School, R.K. Puram", city: "Delhi", board: "CBSE" },
      { name: "Modern School", city: "Delhi", board: "CBSE" },
      { name: "Sardar Patel Vidyalaya", city: "Delhi", board: "CBSE" },
      { name: "Springdales School", city: "Delhi", board: "CBSE" },
      { name: "The Shri Ram School", city: "Delhi", board: "CBSE" },
      { name: "Vasant Valley School", city: "Delhi", board: "CBSE" },
      { name: "Sanskriti School", city: "Delhi", board: "CBSE" },
      { name: "Bal Bharati Public School", city: "Delhi", board: "CBSE" },
      { name: "St. Columba's School", city: "Delhi", board: "CBSE" },
      { name: "Miranda House", city: "Delhi", board: "CBSE" }
    ]
  },
  {
    name: "Goa",
    schools: [
      { name: "Sharada Mandir School", city: "Panaji", board: "CBSE" },
      { name: "Delhi Public School", city: "Panaji", board: "CBSE" },
      { name: "Kendriya Vidyalaya", city: "Panaji", board: "CBSE" },
      { name: "Don Bosco High School", city: "Panaji", board: "CBSE" },
      { name: "Carmel High School", city: "Nuvem", board: "CBSE" },
      { name: "Presentation Convent High School", city: "Margao", board: "CBSE" },
      { name: "Rosary High School", city: "Navelim", board: "CBSE" },
      { name: "Army Public School", city: "Panaji", board: "CBSE" },
      { name: "St. Xavier's High School", city: "Mapusa", board: "CBSE" },
      { name: "Vidya Vikas Academy", city: "Margao", board: "CBSE" }
    ]
  },
  {
    name: "Gujarat",
    schools: [
      { name: "Zydus School for Excellence", city: "Ahmedabad", board: "CBSE" },
      { name: "Delhi Public School", city: "Ahmedabad", board: "CBSE" },
      { name: "Kendriya Vidyalaya", city: "Ahmedabad", board: "CBSE" },
      { name: "Udgam School for Children", city: "Ahmedabad", board: "CBSE" },
      { name: "Calorx Public School", city: "Ahmedabad", board: "CBSE" },
      { name: "Anand Niketan School", city: "Ahmedabad", board: "CBSE" },
      { name: "Rachana School", city: "Ahmedabad", board: "CBSE" },
      { name: "SGVP International School", city: "Ahmedabad", board: "CBSE" },
      { name: "Navrachana International School", city: "Vadodara", board: "IB" },
      { name: "Maharaja Sayajirao University", city: "Vadodara", board: "CBSE" }
    ]
  },
  {
    name: "Haryana",
    schools: [
      { name: "Delhi Public School", city: "Gurgaon", board: "CBSE" },
      { name: "The Shri Ram School", city: "Gurgaon", board: "CBSE" },
      { name: "Amity International School", city: "Gurgaon", board: "CBSE" },
      { name: "GD Goenka Public School", city: "Gurgaon", board: "CBSE" },
      { name: "Kendriya Vidyalaya", city: "Gurgaon", board: "CBSE" },
      { name: "DAV Public School", city: "Gurgaon", board: "CBSE" },
      { name: "Scottish High International School", city: "Gurgaon", board: "CBSE" },
      { name: "Suncity School", city: "Gurgaon", board: "CBSE" },
      { name: "Heritage Xperiential Learning School", city: "Gurgaon", board: "CBSE" },
      { name: "Lotus Valley International School", city: "Gurgaon", board: "CBSE" }
    ]
  },
  {
    name: "Himachal Pradesh",
    schools: [
      { name: "Delhi Public School", city: "Shimla", board: "CBSE" },
      { name: "Kendriya Vidyalaya", city: "Shimla", board: "CBSE" },
      { name: "DAV Public School", city: "Shimla", board: "CBSE" },
      { name: "St. Edward's School", city: "Shimla", board: "CBSE" },
      { name: "Convent of Jesus and Mary", city: "Shimla", board: "CBSE" },
      { name: "Army Public School", city: "Shimla", board: "CBSE" },
      { name: "Jawahar Navodaya Vidyalaya", city: "Shimla", board: "CBSE" },
      { name: "Bishop Cotton School", city: "Shimla", board: "CBSE" },
      { name: "Loreto Convent", city: "Shimla", board: "CBSE" },
      { name: "St. Thomas School", city: "Shimla", board: "CBSE" }
    ]
  },
  {
    name: "Jharkhand",
    schools: [
      { name: "Delhi Public School", city: "Ranchi", board: "CBSE" },
      { name: "Kendriya Vidyalaya", city: "Ranchi", board: "CBSE" },
      { name: "DAV Public School", city: "Ranchi", board: "CBSE" },
      { name: "St. Xavier's School", city: "Ranchi", board: "CBSE" },
      { name: "Jawahar Navodaya Vidyalaya", city: "Ranchi", board: "CBSE" },
      { name: "Army Public School", city: "Ranchi", board: "CBSE" },
      { name: "Carmel Junior College", city: "Ranchi", board: "CBSE" },
      { name: "Loyola School", city: "Jamshedpur", board: "CBSE" },
      { name: "Hill Top School", city: "Jamshedpur", board: "CBSE" },
      { name: "Surendranath Centenary School", city: "Ranchi", board: "CBSE" }
    ]
  },
  {
    name: "Karnataka",
    schools: [
      { name: "Indus International School", city: "Bangalore", board: "IB" },
      { name: "Oakridge International School", city: "Bangalore", board: "IB" },
      { name: "The International School Bangalore", city: "Bangalore", board: "IB" },
      { name: "Greenwood High International School", city: "Bangalore", board: "Cambridge" },
      { name: "Delhi Public School", city: "Bangalore", board: "CBSE" },
      { name: "Bishop Cotton Boys' School", city: "Bangalore", board: "CBSE" },
      { name: "St. Joseph's Boys' High School", city: "Bangalore", board: "CBSE" },
      { name: "Kendriya Vidyalaya", city: "Bangalore", board: "CBSE" },
      { name: "National Public School", city: "Bangalore", board: "CBSE" },
      { name: "Vidyashilp Academy", city: "Bangalore", board: "CBSE" }
    ]
  },
  {
    name: "Kerala",
    schools: [
      { name: "Rajagiri Public School", city: "Kochi", board: "CBSE" },
      { name: "Choice School", city: "Kochi", board: "CBSE" },
      { name: "Delhi Public School", city: "Kochi", board: "CBSE" },
      { name: "Kendriya Vidyalaya", city: "Kochi", board: "CBSE" },
      { name: "Naval Public School", city: "Kochi", board: "CBSE" },
      { name: "Bhavan's Vidya Mandir", city: "Kochi", board: "CBSE" },
      { name: "St. Teresa's School", city: "Kochi", board: "CBSE" },
      { name: "Chinmaya Vidyalaya", city: "Kochi", board: "CBSE" },
      { name: "Loyola School", city: "Trivandrum", board: "CBSE" },
      { name: "Carmel Girls Higher Secondary School", city: "Trivandrum", board: "CBSE" }
    ]
  },
  {
    name: "Madhya Pradesh",
    schools: [
      { name: "Delhi Public School", city: "Bhopal", board: "CBSE" },
      { name: "Kendriya Vidyalaya", city: "Bhopal", board: "CBSE" },
      { name: "Carmel Convent School", city: "Bhopal", board: "CBSE" },
      { name: "St. Joseph's Co-Ed School", city: "Bhopal", board: "CBSE" },
      { name: "Jawahar Navodaya Vidyalaya", city: "Bhopal", board: "CBSE" },
      { name: "Army Public School", city: "Bhopal", board: "CBSE" },
      { name: "Campion School", city: "Bhopal", board: "CBSE" },
      { name: "Sagar Public School", city: "Bhopal", board: "CBSE" },
      { name: "The Sanskaar Valley School", city: "Bhopal", board: "CBSE" },
      { name: "Daly College", city: "Indore", board: "CBSE" }
    ]
  },
  {
    name: "Maharashtra",
    schools: [
      { name: "Cathedral and John Connon School", city: "Mumbai", board: "ICSE" },
      { name: "Bombay Scottish School", city: "Mumbai", board: "ICSE" },
      { name: "Jamnabai Narsee School", city: "Mumbai", board: "ICSE" },
      { name: "Dhirubhai Ambani International School", city: "Mumbai", board: "IB" },
      { name: "American School of Bombay", city: "Mumbai", board: "IB" },
      { name: "Podar International School", city: "Mumbai", board: "CBSE" },
      { name: "Delhi Public School", city: "Pune", board: "CBSE" },
      { name: "Kendriya Vidyalaya", city: "Mumbai", board: "CBSE" },
      { name: "Bishops School", city: "Pune", board: "ICSE" },
      { name: "Symbiosis International School", city: "Pune", board: "Cambridge" }
    ]
  },
  {
    name: "Manipur",
    schools: [
      { name: "Delhi Public School", city: "Imphal", board: "CBSE" },
      { name: "Kendriya Vidyalaya", city: "Imphal", board: "CBSE" },
      { name: "DAV Public School", city: "Imphal", board: "CBSE" },
      { name: "Little Flower School", city: "Imphal", board: "CBSE" },
      { name: "Jawahar Navodaya Vidyalaya", city: "Imphal", board: "CBSE" },
      { name: "Army Public School", city: "Imphal", board: "CBSE" },
      { name: "Standard Robarth Higher Secondary School", city: "Imphal", board: "CBSE" },
      { name: "Nirmalabas High School", city: "Imphal", board: "CBSE" },
      { name: "Don Bosco High School", city: "Imphal", board: "CBSE" },
      { name: "Sangai International School", city: "Imphal", board: "CBSE" }
    ]
  },
  {
    name: "Meghalaya",
    schools: [
      { name: "Delhi Public School", city: "Shillong", board: "CBSE" },
      { name: "Kendriya Vidyalaya", city: "Shillong", board: "CBSE" },
      { name: "St. Edmund's School", city: "Shillong", board: "CBSE" },
      { name: "Loreto Convent", city: "Shillong", board: "CBSE" },
      { name: "Pine Mount School", city: "Shillong", board: "CBSE" },
      { name: "Don Bosco School", city: "Shillong", board: "CBSE" },
      { name: "Jawahar Navodaya Vidyalaya", city: "Shillong", board: "CBSE" },
      { name: "Army Public School", city: "Shillong", board: "CBSE" },
      { name: "St. Anthony's Higher Secondary School", city: "Shillong", board: "CBSE" },
      { name: "Marian Hill High School", city: "Shillong", board: "CBSE" }
    ]
  },
  {
    name: "Mizoram",
    schools: [
      { name: "Delhi Public School", city: "Aizawl", board: "CBSE" },
      { name: "Kendriya Vidyalaya", city: "Aizawl", board: "CBSE" },
      { name: "Jawahar Navodaya Vidyalaya", city: "Aizawl", board: "CBSE" },
      { name: "Army Public School", city: "Aizawl", board: "CBSE" },
      { name: "Govt. Aizawl North College", city: "Aizawl", board: "CBSE" },
      { name: "St. Paul's Higher Secondary School", city: "Aizawl", board: "CBSE" },
      { name: "Synod Higher Secondary School", city: "Aizawl", board: "CBSE" },
      { name: "Ramhlun North Higher Secondary School", city: "Aizawl", board: "CBSE" },
      { name: "Govt. Champhai College", city: "Champhai", board: "CBSE" },
      { name: "Presbyterian Church Higher Secondary School", city: "Aizawl", board: "CBSE" }
    ]
  },
  {
    name: "Nagaland",
    schools: [
      { name: "Delhi Public School", city: "Kohima", board: "CBSE" },
      { name: "Kendriya Vidyalaya", city: "Kohima", board: "CBSE" },
      { name: "Jawahar Navodaya Vidyalaya", city: "Kohima", board: "CBSE" },
      { name: "Army Public School", city: "Kohima", board: "CBSE" },
      { name: "Don Bosco Higher Secondary School", city: "Kohima", board: "CBSE" },
      { name: "Little Flower School", city: "Kohima", board: "CBSE" },
      { name: "Holy Cross School", city: "Kohima", board: "CBSE" },
      { name: "Baptist High School", city: "Kohima", board: "CBSE" },
      { name: "Govt. Higher Secondary School", city: "Kohima", board: "CBSE" },
      { name: "Mount Hermon School", city: "Kohima", board: "CBSE" }
    ]
  },
  {
    name: "Odisha",
    schools: [
      { name: "Delhi Public School", city: "Bhubaneswar", board: "CBSE" },
      { name: "Kendriya Vidyalaya", city: "Bhubaneswar", board: "CBSE" },
      { name: "DAV Public School", city: "Bhubaneswar", board: "CBSE" },
      { name: "St. Xavier's High School", city: "Bhubaneswar", board: "CBSE" },
      { name: "Jawahar Navodaya Vidyalaya", city: "Bhubaneswar", board: "CBSE" },
      { name: "Army Public School", city: "Bhubaneswar", board: "CBSE" },
      { name: "Carmel School", city: "Bhubaneswar", board: "CBSE" },
      { name: "Stewart School", city: "Cuttack", board: "CBSE" },
      { name: "Loyola School", city: "Bhubaneswar", board: "CBSE" },
      { name: "Kalinga Institute of Social Sciences", city: "Bhubaneswar", board: "CBSE" }
    ]
  },
  {
    name: "Punjab",
    schools: [
      { name: "Delhi Public School", city: "Ludhiana", board: "CBSE" },
      { name: "Kendriya Vidyalaya", city: "Chandigarh", board: "CBSE" },
      { name: "DAV Public School", city: "Chandigarh", board: "CBSE" },
      { name: "St. John's High School", city: "Chandigarh", board: "CBSE" },
      { name: "Sacred Heart Senior Secondary School", city: "Chandigarh", board: "CBSE" },
      { name: "Jawahar Navodaya Vidyalaya", city: "Ludhiana", board: "CBSE" },
      { name: "Army Public School", city: "Chandigarh", board: "CBSE" },
      { name: "Carmel Convent School", city: "Chandigarh", board: "CBSE" },
      { name: "St. Anne's Convent School", city: "Chandigarh", board: "CBSE" },
      { name: "Vivek High School", city: "Chandigarh", board: "CBSE" }
    ]
  },
  {
    name: "Rajasthan",
    schools: [
      { name: "Delhi Public School", city: "Jaipur", board: "CBSE" },
      { name: "Kendriya Vidyalaya", city: "Jaipur", board: "CBSE" },
      { name: "The Doon School", city: "Jaipur", board: "CBSE" },
      { name: "St. Xavier's School", city: "Jaipur", board: "CBSE" },
      { name: "Maharaja Sawai Man Singh Vidyalaya", city: "Jaipur", board: "CBSE" },
      { name: "Jawahar Navodaya Vidyalaya", city: "Jaipur", board: "CBSE" },
      { name: "Army Public School", city: "Jaipur", board: "CBSE" },
      { name: "Neerja Modi School", city: "Jaipur", board: "CBSE" },
      { name: "Seedling Public School", city: "Jaipur", board: "CBSE" },
      { name: "Jayshree Periwal International School", city: "Jaipur", board: "IB" }
    ]
  },
  {
    name: "Sikkim",
    schools: [
      { name: "Delhi Public School", city: "Gangtok", board: "CBSE" },
      { name: "Kendriya Vidyalaya", city: "Gangtok", board: "CBSE" },
      { name: "Jawahar Navodaya Vidyalaya", city: "Gangtok", board: "CBSE" },
      { name: "Army Public School", city: "Gangtok", board: "CBSE" },
      { name: "Tashi Namgyal Academy", city: "Gangtok", board: "CBSE" },
      { name: "Enchey Monastery School", city: "Gangtok", board: "CBSE" },
      { name: "Little Flower School", city: "Gangtok", board: "CBSE" },
      { name: "Paljor Namgyal Girls Senior Secondary School", city: "Gangtok", board: "CBSE" },
      { name: "Govt. Boys Senior Secondary School", city: "Gangtok", board: "CBSE" },
      { name: "St. Xavier's School", city: "Pakyong", board: "CBSE" }
    ]
  },
  {
    name: "Tamil Nadu",
    schools: [
      { name: "American International School", city: "Chennai", board: "IB" },
      { name: "Chettinad Vidyashram", city: "Chennai", board: "CBSE" },
      { name: "Delhi Public School", city: "Chennai", board: "CBSE" },
      { name: "Kendriya Vidyalaya", city: "Chennai", board: "CBSE" },
      { name: "P.S. Senior Secondary School", city: "Chennai", board: "CBSE" },
      { name: "Vidya Mandir Senior Secondary School", city: "Chennai", board: "CBSE" },
      { name: "Lady Andal Venkatasubba Rao School", city: "Chennai", board: "CBSE" },
      { name: "Sishya School", city: "Chennai", board: "CBSE" },
      { name: "The Hindu Senior Secondary School", city: "Chennai", board: "CBSE" },
      { name: "Padma Seshadri Bala Bhavan", city: "Chennai", board: "CBSE" }
    ]
  },
  {
    name: "Telangana",
    schools: [
      { name: "Oakridge International School", city: "Hyderabad", board: "IB" },
      { name: "Indus International School", city: "Hyderabad", board: "IB" },
      { name: "Bharatiya Vidya Bhavan", city: "Hyderabad", board: "CBSE" },
      { name: "Nasr School", city: "Hyderabad", board: "CBSE" },
      { name: "Meridian School", city: "Hyderabad", board: "CBSE" },
      { name: "Chirec International School", city: "Hyderabad", board: "Cambridge" },
      { name: "Glendale Academy", city: "Hyderabad", board: "CBSE" },
      { name: "Sancta Maria International School", city: "Hyderabad", board: "CBSE" },
      { name: "Bhashyam Public School", city: "Hyderabad", board: "CBSE" },
      { name: "Gowtham Model School", city: "Hyderabad", board: "CBSE" }
    ]
  },
  {
    name: "Tripura",
    schools: [
      { name: "Delhi Public School", city: "Agartala", board: "CBSE" },
      { name: "Kendriya Vidyalaya", city: "Agartala", board: "CBSE" },
      { name: "Jawahar Navodaya Vidyalaya", city: "Agartala", board: "CBSE" },
      { name: "Army Public School", city: "Agartala", board: "CBSE" },
      { name: "Holy Cross School", city: "Agartala", board: "CBSE" },
      { name: "Ramthakur Paul Memorial High School", city: "Agartala", board: "CBSE" },
      { name: "Netaji Subhash Vidyaniketan", city: "Agartala", board: "CBSE" },
      { name: "Maharani Tulsibati Girls High School", city: "Agartala", board: "CBSE" },
      { name: "Govt. Girls Higher Secondary School", city: "Agartala", board: "CBSE" },
      { name: "Shishu Bihar Higher Secondary School", city: "Agartala", board: "CBSE" }
    ]
  },
  {
    name: "Uttar Pradesh",
    schools: [
      { name: "Delhi Public School", city: "Noida", board: "CBSE" },
      { name: "Amity International School", city: "Noida", board: "CBSE" },
      { name: "Genesis Global School", city: "Noida", board: "CBSE" },
      { name: "Kendriya Vidyalaya", city: "Lucknow", board: "CBSE" },
      { name: "La Martiniere College", city: "Lucknow", board: "CBSE" },
      { name: "City Montessori School", city: "Lucknow", board: "CBSE" },
      { name: "Colvin Taluqdars' College", city: "Lucknow", board: "CBSE" },
      { name: "St. Francis' College", city: "Lucknow", board: "CBSE" },
      { name: "Jawahar Navodaya Vidyalaya", city: "Lucknow", board: "CBSE" },
      { name: "Army Public School", city: "Lucknow", board: "CBSE" }
    ]
  },
  {
    name: "Uttarakhand",
    schools: [
      { name: "The Doon School", city: "Dehradun", board: "CBSE" },
      { name: "Welham Girls' School", city: "Dehradun", board: "CBSE" },
      { name: "Woodstock School", city: "Mussoorie", board: "IB" },
      { name: "Delhi Public School", city: "Dehradun", board: "CBSE" },
      { name: "Kendriya Vidyalaya", city: "Dehradun", board: "CBSE" },
      { name: "Brightlands School", city: "Dehradun", board: "CBSE" },
      { name: "Jawahar Navodaya Vidyalaya", city: "Dehradun", board: "CBSE" },
      { name: "Army Public School", city: "Dehradun", board: "CBSE" },
      { name: "Convent of Jesus and Mary", city: "Dehradun", board: "CBSE" },
      { name: "St. Joseph's Academy", city: "Dehradun", board: "CBSE" }
    ]
  },
  {
    name: "West Bengal",
    schools: [
      { name: "La Martiniere for Boys", city: "Kolkata", board: "ICSE" },
      { name: "St. Xavier's Collegiate School", city: "Kolkata", board: "ICSE" },
      { name: "Delhi Public School", city: "Kolkata", board: "CBSE" },
      { name: "Kendriya Vidyalaya", city: "Kolkata", board: "CBSE" },
      { name: "South Point High School", city: "Kolkata", board: "ICSE" },
      { name: "Loreto House", city: "Kolkata", board: "ICSE" },
      { name: "Modern High School for Girls", city: "Kolkata", board: "ICSE" },
      { name: "Bishop's School", city: "Kolkata", board: "ICSE" },
      { name: "Jawahar Navodaya Vidyalaya", city: "Kolkata", board: "CBSE" },
      { name: "Army Public School", city: "Kolkata", board: "CBSE" }
    ]
  }
];

export const getStateNames = (): string[] => {
  return INDIAN_STATES_SCHOOLS.map(state => state.name);
};

export const getSchoolsByState = (stateName: string): School[] => {
  const state = INDIAN_STATES_SCHOOLS.find(s => s.name === stateName);
  return state ? state.schools : [];
};

export const getAllSchools = (): School[] => {
  return INDIAN_STATES_SCHOOLS.flatMap(state => state.schools);
};

// New helper functions for the state → city → board → school workflow

export const getCitiesByState = (stateName: string): string[] => {
  const schools = getSchoolsByState(stateName);
  const cities = [...new Set(schools.map(school => school.city))];
  return cities.sort();
};

export const getBoardsByStateAndCity = (stateName: string, cityName: string): string[] => {
  const schools = getSchoolsByState(stateName);
  const citySchools = schools.filter(school => school.city === cityName);
  const boards = [...new Set(citySchools.map(school => school.board))];
  return boards.sort();
};

export const getSchoolsByStateAndCityAndBoard = (stateName: string, cityName: string, boardType: string): School[] => {
  const schools = getSchoolsByState(stateName);
  return schools.filter(school => 
    school.city === cityName && school.board === boardType
  );
};

export const getAllBoardTypes = (): string[] => {
  const allSchools = getAllSchools();
  const boards = [...new Set(allSchools.map(school => school.board))];
  return boards.sort();
};

export const getAllCities = (): string[] => {
  const allSchools = getAllSchools();
  const cities = [...new Set(allSchools.map(school => school.city))];
  return cities.sort();
}; 