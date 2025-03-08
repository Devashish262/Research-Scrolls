import type { Paper } from "@shared/schema";

const basePapers: Paper[] = [
  {
    id: 1,
    title: "Deep Learning Approaches in Mobile Edge Computing",
    abstract: "Mobile edge computing (MEC) has emerged as a promising paradigm that brings cloud computing capabilities closer to mobile users. This paper surveys the integration of deep learning in MEC, analyzing various architectures and their implications for latency-sensitive applications. We present a comprehensive review of current approaches and highlight future research directions.",
    authors: "Sarah Chen, Michael Smith, David Wilson",
    url: "https://arxiv.org/abs/2301.00001",
    publishedDate: "2024-01-15",
    journal: "IEEE Transactions on Mobile Computing",
    source: "local"
  },
  {
    id: 2,
    title: "Quantum Computing: A New Era in Cryptography",
    abstract: "The advent of quantum computing poses both opportunities and challenges for cryptographic systems. This paper examines the implications of quantum computing on current cryptographic protocols and proposes new quantum-resistant algorithms. We demonstrate the vulnerability of existing systems and provide a framework for developing robust quantum-safe encryption methods.",
    authors: "James Rodriguez, Lisa Wang",
    url: "https://arxiv.org/abs/2301.00002",
    publishedDate: "2024-02-01",
    journal: "Journal of Cryptography",
    source: "local"
  },
  {
    id: 3,
    title: "Sustainable AI: Environmental Impact of Large Language Models",
    abstract: "As large language models continue to grow in size and complexity, their environmental impact becomes increasingly concerning. This study quantifies the carbon footprint of training and deploying major language models, proposing novel techniques for reducing energy consumption while maintaining performance. We present empirical evidence and practical recommendations for sustainable AI development.",
    authors: "Emma Brown, Alex Johnson, Peter Zhang",
    url: "https://arxiv.org/abs/2301.00003",
    publishedDate: "2024-02-10",
    journal: "Nature Sustainability",
    source: "local"
  },
  {
    id: 4,
    title: "Emerging Trends in CRISPR Gene Editing Technologies",
    abstract: "Recent advances in CRISPR-Cas9 technology have revolutionized genetic engineering capabilities. This review examines the latest developments in CRISPR-based methods, focusing on improved precision, reduced off-target effects, and novel delivery systems. We discuss potential therapeutic applications and ethical considerations in human genome editing.",
    authors: "Maria Garcia, John Lee, Robert Chen",
    url: "https://arxiv.org/abs/2301.00004",
    publishedDate: "2024-02-15",
    journal: "Nature Biotechnology",
    source: "local"
  },
  {
    id: 5,
    title: "Neural Networks in Climate Change Prediction",
    abstract: "This research presents a novel approach to climate change prediction using advanced neural network architectures. By incorporating multi-modal data from satellite imagery, weather stations, and historical records, our model achieves unprecedented accuracy in long-term climate forecasting. The findings have significant implications for climate adaptation strategies.",
    authors: "Thomas Anderson, Sarah Miller",
    url: "https://arxiv.org/abs/2301.00005",
    publishedDate: "2024-02-20",
    journal: "Science Advances",
    source: "local"
  },
  {
    id: 6,
    title: "Superconductivity at Room Temperature: Recent Breakthroughs in Materials Science",
    abstract: "This paper presents recent experimental data on novel materials exhibiting superconducting properties at unprecedented temperatures. We detail the synthesis processes, characterization methods, and theoretical models explaining these phenomena. The discovery has profound implications for energy transmission, storage, and quantum computing applications.",
    authors: "Elena Rodriguez, Wei Zhang",
    url: "https://arxiv.org/abs/2301.00006",
    publishedDate: "2024-01-05",
    journal: "Physical Review Letters",
    source: "local"
  },
  {
    id: 7,
    title: "Molecular Mechanisms of Neurodegeneration in Alzheimer's Disease",
    abstract: "This comprehensive review examines the latest findings regarding the molecular and cellular pathways involved in Alzheimer's disease progression. We analyze the roles of amyloid-beta, tau proteins, neuroinflammation, and mitochondrial dysfunction, presenting an integrated model of disease pathogenesis. Novel therapeutic targets and approaches are discussed.",
    authors: "Jennifer Kumar, Robert Chen, Maria Santos",
    url: "https://arxiv.org/abs/2301.00007",
    publishedDate: "2024-01-20",
    journal: "Nature Reviews Neuroscience",
    source: "local"
  },
  {
    id: 8,
    title: "Mathematical Foundations of Topological Quantum Field Theory",
    abstract: "This paper presents a rigorous mathematical framework for understanding topological quantum field theories (TQFTs). We develop new algebraic structures that capture the essential properties of quantum field theories with topological invariance. Applications to knot theory, condensed matter physics, and quantum computing are explored in detail.",
    authors: "David Yang, Sophie Martin",
    url: "https://arxiv.org/abs/2301.00008",
    publishedDate: "2024-01-25",
    journal: "Communications in Mathematical Physics",
    source: "local"
  },
  {
    id: 9,
    title: "Synthetic Biology Approaches to Sustainable Biofuel Production",
    abstract: "We review recent advances in synthetic biology for enhanced biofuel production from renewable resources. This paper describes novel genetic engineering strategies, metabolic pathway optimization, and synthetic microbial communities designed for efficient conversion of biomass to advanced biofuels. Economic and environmental impact analyses are included.",
    authors: "Carlos Mendez, Lisa Johnson, Ahmed Hassan",
    url: "https://arxiv.org/abs/2301.00009",
    publishedDate: "2024-02-05",
    journal: "Biotechnology and Bioengineering",
    source: "local"
  },
  {
    id: 10,
    title: "Advanced Catalysts for Hydrogen Evolution Reaction: A Step Toward Sustainable Energy",
    abstract: "This research introduces a new class of non-precious metal catalysts for efficient hydrogen production through water electrolysis. We present detailed synthesis protocols, characterization data, and performance metrics showing activity comparable to platinum-based catalysts at a fraction of the cost. The findings accelerate the transition to a hydrogen-based economy.",
    authors: "Min-Jae Kim, Alexander Wright",
    url: "https://arxiv.org/abs/2301.00010",
    publishedDate: "2024-02-12",
    journal: "Journal of the American Chemical Society",
    source: "local"
  }
];

// Function to generate more papers based on the base papers with more realistic variations
export function generateMockPapers(count: number): Paper[] {
  const papers: Paper[] = [];
  const topics = [
    "AI", 
    "Quantum Computing", 
    "Climate Science", 
    "Biotechnology", 
    "Robotics", 
    "Physics", 
    "Chemistry", 
    "Biology", 
    "Computer Science", 
    "Mathematics",
    "Neuroscience",
    "Materials Science",
    "Medicine",
    "Astronomy",
    "Environmental Science",
    "Agriculture",
    "Psychology",
    "Renewable Energy",
    "Data Science",
    "Genetics",
    "Virology",
    "Nutrition",
    "Nanotechnology",
    "Marine Biology",
    "Archaeology",
    "Geology",
    "Economics",
    "Cybersecurity",
    "Artificial Intelligence Ethics",
    "Machine Learning"
  ];
  
  const journals = [
    "Nature", 
    "Science", 
    "Cell", 
    "Physical Review Letters",
    "IEEE Transactions", 
    "ACM Computing Surveys", 
    "PLOS ONE",
    "Journal of the American Chemical Society",
    "The Lancet",
    "New England Journal of Medicine",
    "Astrophysical Journal",
    "Journal of Materials Chemistry",
    "Bioinformatics",
    "Communications in Mathematical Physics",
    "Environmental Science & Technology",
    "Journal of Agricultural Science",
    "Psychological Review",
    "Renewable Energy",
    "Data Mining and Knowledge Discovery",
    "Genetics Research",
    "Journal of Virology",
    "American Journal of Clinical Nutrition",
    "Nanotechnology",
    "Marine Biology Research",
    "Journal of Archaeological Science",
    "Geology",
    "Journal of Economic Literature",
    "Cybersecurity Journal",
    "AI and Ethics",
    "Journal of Machine Learning Research"
  ];

  // Additional paper prefixes for more variety
  const prefixes = [
    "Advances in",
    "Recent Developments in",
    "Novel Approaches to",
    "Breakthroughs in",
    "Applications of",
    "Innovative Methods for",
    "Exploring",
    "Analysis of",
    "Fundamentals of",
    "Critical Review of",
    "Challenges in",
    "Future Directions in",
    "Experimental Study of",
    "Theoretical Framework for",
    "Comparative Study of"
  ];

  // Sources with their weights (probability of selection)
  const sources = [
    { id: "local", weight: 20 },
    { id: "arxiv", weight: 20 },
    { id: "pubmed", weight: 15 },
    { id: "ieee", weight: 15 },
    { id: "springer", weight: 15 },
    { id: "sciencedirect", weight: 15 }
  ];
  
  // Total weight for source selection
  const totalWeight = sources.reduce((sum, source) => sum + source.weight, 0);

  for (let i = 0; i < count; i++) {
    const basePaper = basePapers[i % basePapers.length];
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const journal = journals[Math.floor(Math.random() * journals.length)];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    
    // Select a source based on weight
    const randomWeight = Math.random() * totalWeight;
    let runningWeight = 0;
    let selectedSource = sources[0].id;
    
    for (const source of sources) {
      runningWeight += source.weight;
      if (randomWeight <= runningWeight) {
        selectedSource = source.id;
        break;
      }
    }

    // Generate a more varied title
    let title: string;
    if (Math.random() > 0.5) {
      title = `${topic} Research: ${prefix} ${basePaper.title} - Study ${Math.floor(i / basePapers.length) + 1}`;
    } else {
      title = `${prefix} ${topic}: ${basePaper.title.split(':')[1] || basePaper.title} (Version ${Math.floor(i / basePapers.length) + 1})`;
    }

    // Generate more varied and realistic authors
    const authorCount = 2 + Math.floor(Math.random() * 4); // 2-5 authors
    const firstNames = [
      "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth",
      "Wei", "Aisha", "Mohammed", "Elena", "Hiroshi", "Fatima", "Rajesh", "Mei", "Sven", "Priya",
      "Carlos", "Sofia", "Ahmed", "Olga", "Kim", "Ananya", "Jamal", "Chen", "Diego", "Layla"
    ];
    const lastNames = [
      "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez",
      "Zhang", "Wang", "Singh", "Patel", "Kim", "Nguyen", "Chen", "Lee", "Ali", "Khan",
      "Müller", "Ivanov", "Suzuki", "Silva", "Rossi", "Kowalski", "Okafor", "Dubois", "Jensen", "Andersen"
    ];
    const institutions = [
      "University of Cambridge", "Stanford University", "MIT", "Harvard University", "Max Planck Institute",
      "Tokyo University", "Tsinghua University", "University of Toronto", "ETH Zurich", "National University of Singapore",
      "University of Cape Town", "University of São Paulo", "Indian Institute of Technology", "Seoul National University",
      "Australian National University"
    ];
    
    const authors = Array(authorCount).fill(0).map(() => {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const institution = institutions[Math.floor(Math.random() * institutions.length)];
      return Math.random() > 0.5 ? `${firstName} ${lastName}` : `${firstName} ${lastName} (${institution})`;
    }).join(", ");

    // Generate paper with more variation
    papers.push({
      ...basePaper,
      id: i + 1,
      title: title,
      authors: authors,
      journal: journal,
      url: getSourceUrl(selectedSource, i),
      publishedDate: getRandomDate(),
      source: selectedSource
    });
  }
  
  return papers;
}

// Export a larger set of mock papers
export const mockPapers = generateMockPapers(500);

// Helper function to get URL based on source
function getSourceUrl(source: string, index: number): string {
  switch (source) {
    case "arxiv":
      return `https://arxiv.org/abs/${(2400 + Math.floor(index / 100)).toString().padStart(2, '0')}.${index.toString().padStart(5, '0')}`;
    case "pubmed":
      return `https://pubmed.ncbi.nlm.nih.gov/${30000000 + index}/`;
    case "ieee":
      return `https://ieeexplore.ieee.org/document/${8000000 + index}/`;
    case "springer":
      return `https://link.springer.com/article/10.1007/s${40000 + index}-${2023 + Math.floor(index / 1000)}-${index % 1000}-${index % 10}`;
    case "sciencedirect":
      return `https://www.sciencedirect.com/science/article/pii/S${(index * 13579).toString().padStart(16, '0')}`;
    default:
      return `https://example.com/papers/${index}`;
  }
}

// Helper function to generate random dates
function getRandomDate(): string {
  const year = 2020 + Math.floor(Math.random() * 5);
  const month = 1 + Math.floor(Math.random() * 12);
  const day = 1 + Math.floor(Math.random() * 28);
  return new Date(year, month - 1, day).toISOString().split('T')[0];
}