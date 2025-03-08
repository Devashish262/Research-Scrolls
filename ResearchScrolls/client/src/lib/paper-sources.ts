import type { Paper } from "@shared/schema";
import { mockPapers } from "./mock-data";
import { apiCache } from "./api-cache";

// List of supported paper sources
export const PAPER_SOURCES = [
  { id: "local", name: "Local Database" },
  { id: "arxiv", name: "arXiv" },
  { id: "pubmed", name: "PubMed" },
  { id: "semanticscholar", name: "Semantic Scholar" },
  { id: "ieee", name: "IEEE Xplore" },
  { id: "springer", name: "Springer" },
  { id: "sciencedirect", name: "ScienceDirect" },
  { id: "nature", name: "Nature" },
  { id: "science", name: "Science" },
  { id: "biorxiv", name: "bioRxiv" }
];

// Interface for search parameters
export interface PaperSearchParams {
  query: string;
  subject?: string;
  limit?: number;
}

/**
 * Searches for papers across all sources simultaneously
 */
export async function searchPapers(params: PaperSearchParams): Promise<Paper[]> {
  const { query, subject, limit = 250 } = params;
  
  // Define sources to search
  const sources = ["local", "arxiv", "pubmed", "semanticscholar", "ieee", "springer", "sciencedirect", "nature", "science", "biorxiv"];
  
  // Calculate how many results to get per source to reach the limit
  const perSourceLimit = Math.ceil(limit / sources.length);
  
  // Get results from all sources in parallel
  const promises = sources.map(async (source) => {
    try {
      let results: Paper[] = [];
      const queryString = `${query}${subject && subject !== "All" ? ` ${subject}` : ''}`;
      
      switch (source) {
        case "local":
          results = filterMockPapers(query, subject, perSourceLimit).map(paper => ({
            ...paper,
            source: "local"
          }));
          break;
        case "arxiv":
          results = await fetchArxivPapers(query, subject, perSourceLimit);
          break;
        case "pubmed":
          results = await fetchPubmedPapers(query, subject, perSourceLimit);
          break;
        case "semanticscholar":
          results = await fetchSemanticScholarPapers(query, subject, perSourceLimit);
          break;
        case "biorxiv":
          results = await fetchBiorxivPapers(query, subject, perSourceLimit);
          break;
        default:
          // Fall back to mock data for other sources
          results = mockExternalApiCall(source, query, subject, perSourceLimit).map(paper => ({
            ...paper,
            source
          }));
      }
      
      return results;
    } catch (error) {
      console.error(`Error fetching from ${source}:`, error);
      // Return empty array on error
      return [];
    }
  });
  
  // Wait for all searches to complete
  const results = await Promise.all(promises);
  
  // Combine and flatten the results
  const allPapers = results.flat();
  
  // Shuffle results to mix papers from different sources
  const shuffledPapers = shuffleArray(allPapers);
  
  // Apply final limit
  return shuffledPapers.slice(0, limit);
}

/**
 * Fetch papers from the arXiv API
 */
async function fetchArxivPapers(query: string, subject?: string, limit = 50): Promise<Paper[]> {
  try {
    // Prepare search query - combine main query with subject if provided
    let searchQuery = query;
    if (subject && subject !== "All") {
      searchQuery = `${query} ${subject}`;
    }
    
    // Use cleaned search query for cache key
    const cleanedQuery = searchQuery.trim() || "recent";
    
    // Use the cache system
    return await apiCache.getOrFetch(
      `arxiv:${cleanedQuery}:${limit}`,
      async () => {
        // Build the URL with proper encoding
        const encodedQuery = encodeURIComponent(cleanedQuery);
        
        // Query the arXiv API
        const response = await fetch(`https://export.arxiv.org/api/query?search_query=all:${encodedQuery}&start=0&max_results=${limit}&sortBy=relevance`);
        
        if (!response.ok) {
          throw new Error(`arXiv API error: ${response.status}`);
        }
        
        const xmlText = await response.text();
        
        // Parse the XML response - here we'll use a simplified approach
        // In a production app, you would use a proper XML parser
        const papers: Paper[] = [];
        const entries = xmlText.split('<entry>').slice(1);
        
        entries.forEach((entry, index) => {
          // Extract data with basic string operations
          const id = extractXmlValue(entry, '<id>', '</id>');
          const title = extractXmlValue(entry, '<title>', '</title>')?.replace(/\s+/g, ' ').trim() || 'Untitled';
          
          // Extract and clean the abstract
          let abstract = extractXmlValue(entry, '<summary>', '</summary>');
          // Clean the abstract text
          abstract = abstract
            .replace(/\s+/g, ' ')    // Normalize whitespace
            .replace(/\\n/g, ' ')    // Remove newline characters
            .replace(/\\"/g, '"')    // Fix escaped quotes
            .replace(/\$([^$]+)\$/g, '$1') // Remove math delimiters for better readability
            .trim();
            
          if (!abstract) {
            abstract = 'No abstract available';
          }
          
          const publishedDate = extractXmlValue(entry, '<published>', '</published>')?.slice(0, 10) || '';
          
          // Extract authors correctly using the name tag
          const authorMatches = Array.from(entry.matchAll(/<author>([\s\S]*?)<\/author>/g));
          const authors = authorMatches
            .map(match => {
              const authorContent = match[1];
              return extractXmlValue(authorContent, '<name>', '</name>');
            })
            .filter(Boolean)
            .join(', ');
          
          // Extract categories/subjects
          const categoryMatches = Array.from(entry.matchAll(/category term="([^"]+)"/g));
          const categories = categoryMatches.map(match => match[1]);
          const primaryCategory = categories[0] || '';
          
          // Extract link to the paper
          const linkMatch = entry.match(/<link title="pdf" href="([^"]+)"/);
          const url = linkMatch ? linkMatch[1] : `https://arxiv.org/abs/${id.split('/').pop()}`;
          
          papers.push({
            id: 1000 + index,
            title,
            abstract,
            authors,
            journal: `arXiv ${primaryCategory}`,
            publishedDate,
            url,
            source: "arxiv"
          });
        });
        
        return papers;
      },
      cleanedQuery
    );
  } catch (error) {
    console.error('Error fetching from arXiv:', error);
    return fallbackToMock("arxiv", query, subject, limit);
  }
}

/**
 * Fetch papers from PubMed using the NCBI E-utilities API
 */
async function fetchPubmedPapers(query: string, subject?: string, limit = 50): Promise<Paper[]> {
  try {
    // Prepare search query - combine main query with subject if provided
    let searchQuery = query;
    if (subject && subject !== "All") {
      searchQuery = `${query} ${subject}`;
    }
    
    // Use cleaned search query for cache key
    const cleanedQuery = searchQuery.trim() || "recent";
    
    // Use the cache system
    return await apiCache.getOrFetch(
      `pubmed:${cleanedQuery}:${limit}`,
      async () => {
        const encodedQuery = encodeURIComponent(cleanedQuery);
        
        // First, search for IDs using esearch
        const searchResponse = await fetch(
          `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodedQuery}&retmax=${limit}&retmode=json`
        );
        
        if (!searchResponse.ok) {
          throw new Error(`PubMed search API error: ${searchResponse.status}`);
        }
        
        const searchData = await searchResponse.json();
        const ids = searchData?.esearchresult?.idlist || [];
        
        if (ids.length === 0) {
          return [];
        }
        
        // For each article, fetch the full details including abstract using efetch with XML format
        // as the JSON format doesn't include abstracts
        const detailsResponse = await fetch(
          `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${ids.join(',')}&retmode=xml`
        );
        
        if (!detailsResponse.ok) {
          throw new Error(`PubMed details API error: ${detailsResponse.status}`);
        }
        
        const xmlText = await detailsResponse.text();
        
        // Also get the summary data which has some structured fields
        const summaryResponse = await fetch(
          `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids.join(',')}&retmode=json`
        );
        
        let summaryData = {};
        if (summaryResponse.ok) {
          summaryData = await summaryResponse.json();
        }
        
        const papers: Paper[] = [];
        
        // Process each result
        ids.forEach((id, index) => {
          // Get abstract from XML
          const abstract = extractAbstractFromPubmedXml(xmlText, id);
          
          // Get the summary data for additional information
          const summary = summaryData?.result?.[id];
          
          // Title
          let title = '';
          if (summary?.title) {
            title = summary.title;
          } else {
            // Try to extract from XML if summary not available
            const titlePattern = new RegExp(`<PubmedArticle>([\\s\\S]*?)<PMID>${id}</PMID>([\\s\\S]*?)<ArticleTitle>([\\s\\S]*?)</ArticleTitle>`, 'i');
            const titleMatch = xmlText.match(titlePattern);
            title = titleMatch ? titleMatch[3].trim() : 'Untitled';
          }
          
          // Authors
          let authors = '';
          if (summary?.authors && Array.isArray(summary.authors)) {
            authors = summary.authors
              .map((author: any) => author.name)
              .join(', ');
          } else {
            // Try to extract from XML if summary not available
            const authorMatches = Array.from(xmlText.matchAll(new RegExp(`<PubmedArticle>[\\s\\S]*?<PMID>${id}</PMID>[\\s\\S]*?<Author>[\\s\\S]*?<LastName>([^<]+)</LastName>[\\s\\S]*?<ForeName>([^<]+)</ForeName>[\\s\\S]*?</Author>`, 'g')));
            authors = authorMatches
              .map(match => `${match[2]} ${match[1]}`)
              .join(', ');
          }
          
          // Journal and date
          const journal = summary?.fulljournalname || summary?.source || 'PubMed Journal';
          let publishedDate = '';
          
          if (summary?.pubdate) {
            // Convert date to YYYY-MM-DD format if possible
            const dateMatch = summary.pubdate.match(/(\d{4})(?: ([A-Za-z]{3}))?(?: (\d{1,2}))?/);
            
            if (dateMatch) {
              const year = dateMatch[1];
              const month = dateMatch[2] ? getMonthNumber(dateMatch[2]) : '01';
              const day = dateMatch[3] ? dateMatch[3].padStart(2, '0') : '01';
              publishedDate = `${year}-${month}-${day}`;
            } else {
              publishedDate = summary.pubdate;
            }
          } else {
            // Default to current date if no date found
            publishedDate = new Date().toISOString().split('T')[0];
          }
          
          papers.push({
            id: 2000 + index,
            title,
            abstract,
            authors,
            journal,
            publishedDate,
            url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
            source: "pubmed"
          });
        });
        
        return papers;
      },
      cleanedQuery
    );
  } catch (error) {
    console.error('Error fetching from PubMed:', error);
    return fallbackToMock("pubmed", query, subject, limit);
  }
}

/**
 * Fetch papers from Semantic Scholar API
 */
async function fetchSemanticScholarPapers(query: string, subject?: string, limit = 50): Promise<Paper[]> {
  try {
    // Prepare search query - combine main query with subject if provided
    let searchQuery = query;
    if (subject && subject !== "All") {
      searchQuery = `${query} ${subject}`;
    }
    
    // Use cleaned search query for cache key
    const cleanedQuery = searchQuery.trim() || "recent";
    
    // Use the cache system
    return await apiCache.getOrFetch(
      `semanticscholar:${cleanedQuery}:${limit}`,
      async () => {
        const encodedQuery = encodeURIComponent(cleanedQuery);
        
        // Query the Semantic Scholar API
        const response = await fetch(
          `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodedQuery}&limit=${limit}&fields=title,abstract,authors,venue,year,url,openAccessPdf`
        );
        
        if (!response.ok) {
          throw new Error(`Semantic Scholar API error: ${response.status}`);
        }
        
        const data = await response.json();
        const papers: Paper[] = [];
        
        if (!data.data || !Array.isArray(data.data)) {
          return [];
        }
        
        // Process each result
        data.data.forEach((paper: any, index: number) => {
          // Extract authors
          const authors = (paper.authors || [])
            .map((author: any) => author.name)
            .join(', ');
          
          // Format journal and date
          const journal = paper.venue || 'Semantic Scholar';
          const year = paper.year || new Date().getFullYear();
          const publishedDate = `${year}-01-01`; // Default to January 1st as Semantic Scholar only provides year
          
          // Use openAccessPdf URL if available
          const url = paper.openAccessPdf?.url || paper.url || `https://www.semanticscholar.org/paper/${paper.paperId}`;
          
          papers.push({
            id: 6000 + index, // Using 6000 as the offset for Semantic Scholar
            title: paper.title || 'Untitled',
            abstract: paper.abstract || 'No abstract available',
            authors,
            journal,
            publishedDate,
            url,
            source: "semanticscholar"
          });
        });
        
        return papers;
      },
      cleanedQuery
    );
  } catch (error) {
    console.error('Error fetching from Semantic Scholar:', error);
    return fallbackToMock("semanticscholar", query, subject, limit);
  }
}

/**
 * Fetch papers from bioRxiv API
 */
async function fetchBiorxivPapers(query: string, subject?: string, limit = 50): Promise<Paper[]> {
  try {
    // Prepare search query - combine main query with subject if provided
    let searchQuery = query;
    if (subject && subject !== "All") {
      searchQuery = `${query} ${subject}`;
    }
    
    // Use cleaned search query for cache key
    const cleanedQuery = searchQuery.trim() || "recent";
    
    // Use the cache system
    return await apiCache.getOrFetch(
      `biorxiv:${cleanedQuery}:${limit}`,
      async () => {
        const encodedQuery = encodeURIComponent(cleanedQuery);
        
        // Query the bioRxiv API
        const response = await fetch(
          `https://api.biorxiv.org/details/biorxiv/${encodedQuery}/0/${limit}`
        );
        
        if (!response.ok) {
          throw new Error(`bioRxiv API error: ${response.status}`);
        }
        
        const data = await response.json();
        const papers: Paper[] = [];
        
        if (!data.collection || !Array.isArray(data.collection)) {
          return [];
        }
        
        // Process each result
        data.collection.forEach((paper: any, index: number) => {
          papers.push({
            id: 7000 + index,
            title: paper.title || 'Untitled',
            abstract: paper.abstract || 'No abstract available',
            authors: paper.authors || '',
            journal: 'bioRxiv',
            publishedDate: paper.date || new Date().toISOString().split('T')[0],
            url: paper.doi ? `https://doi.org/${paper.doi}` : '',
            source: "biorxiv"
          });
        });
        
        return papers;
      },
      cleanedQuery
    );
  } catch (error) {
    console.error('Error fetching from bioRxiv:', error);
    return fallbackToMock("biorxiv", query, subject, limit);
  }
}

/**
 * Extract abstract from PubMed XML response
 */
function extractAbstractFromPubmedXml(xml: string, pmid: string): string {
  try {
    // Find the article with the matching PMID
    const articleStart = xml.indexOf(`<PMID>${pmid}</PMID>`);
    if (articleStart === -1) return 'Abstract not available';
    
    // Find the abstract section
    const abstractStartTagIndex = xml.indexOf('<AbstractText', articleStart);
    if (abstractStartTagIndex === -1) return 'Abstract not available';
    
    // Find where the abstract text ends
    const abstractEndTagIndex = xml.indexOf('</AbstractText>', abstractStartTagIndex);
    if (abstractEndTagIndex === -1) return 'Abstract not available';
    
    // Find the > character after the start tag
    const contentStart = xml.indexOf('>', abstractStartTagIndex) + 1;
    if (contentStart > abstractEndTagIndex) return 'Abstract not available';
    
    // Extract the abstract text
    const abstractText = xml.substring(contentStart, abstractEndTagIndex).trim();
    
    // Clean up the text (remove XML entities, etc.)
    return abstractText
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/<[^>]*>/g, '') // Remove any remaining HTML tags
      .trim();
  } catch (error) {
    console.error('Error extracting abstract from PubMed XML:', error);
    return 'Abstract not available';
  }
}

/**
 * Fallback to mock data when an API fails
 */
function fallbackToMock(source: string, query: string, subject?: string, limit = 50): Paper[] {
  console.log(`Falling back to mock data for ${source}`);
  return mockExternalApiCall(source, query, subject, limit).map(paper => ({
    ...paper,
    source
  }));
}

/**
 * Filter local mock papers based on search parameters
 */
function filterMockPapers(query: string, subject?: string, limit?: number): Paper[] {
  let filtered = mockPapers;
  
  // Apply subject filter if specified
  if (subject && subject !== "All") {
    filtered = filtered.filter(paper => 
      paper.title.toLowerCase().includes(subject.toLowerCase()) || 
      paper.abstract.toLowerCase().includes(subject.toLowerCase()) ||
      paper.journal.toLowerCase().includes(subject.toLowerCase())
    );
  }
  
  // Apply query filter if specified
  if (query) {
    const lowercaseQuery = query.toLowerCase();
    filtered = filtered.filter(paper => 
      paper.title.toLowerCase().includes(lowercaseQuery) || 
      paper.abstract.toLowerCase().includes(lowercaseQuery) ||
      paper.authors.toLowerCase().includes(lowercaseQuery) ||
      paper.journal.toLowerCase().includes(lowercaseQuery)
    );
  }
  
  // Apply limit
  if (limit) {
    filtered = filtered.slice(0, limit);
  }
  
  return filtered;
}

/**
 * Helper function to extract values from XML
 */
function extractXmlValue(xml: string, startTag: string, endTag: string): string {
  const startIndex = xml.indexOf(startTag);
  if (startIndex === -1) return '';
  
  const valueStartIndex = startIndex + startTag.length;
  const endIndex = xml.indexOf(endTag, valueStartIndex);
  if (endIndex === -1) return '';
  
  return xml.substring(valueStartIndex, endIndex);
}

/**
 * Helper function to convert month abbreviation to number
 */
function getMonthNumber(monthAbbr: string): string {
  const months: Record<string, string> = {
    'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04',
    'may': '05', 'jun': '06', 'jul': '07', 'aug': '08',
    'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12'
  };
  
  return months[monthAbbr.toLowerCase()] || '01';
}

/**
 * Mock function that simulates fetching from external APIs
 * Used as fallback when real APIs fail or for sources without implemented APIs
 */
function mockExternalApiCall(source: string, query: string, subject?: string, limit = 50): Paper[] {
  // Generate some mock data based on the source
  const papers: Paper[] = [];
  
  // Generate papers that appear to come from the specified source
  for (let i = 0; i < Math.min(100, limit); i++) {
    // Get a random base paper to modify
    const basePaper = mockPapers[Math.floor(Math.random() * mockPapers.length)];
    
    // Only include papers that match query if one is provided
    if (query && !paperMatchesQuery(basePaper, query)) {
      continue;
    }
    
    // Only include papers that match subject if one is provided
    if (subject && subject !== "All" && !paperMatchesSubject(basePaper, subject)) {
      continue;
    }
    
    // Create a new paper with source-specific modifications
    papers.push({
      ...basePaper,
      id: i + getSourceIdOffset(source), // Use different ID range for each source
      url: getSourceUrl(source, i),
      journal: getSourceJournal(source, i),
      publishedDate: getRandomDate()
    });
    
    // Stop once we have enough papers
    if (papers.length >= limit) {
      break;
    }
  }
  
  return papers;
}

/**
 * Get an ID offset for a source to prevent ID collisions
 */
function getSourceIdOffset(source: string): number {
  switch (source) {
    case "arxiv": return 1000;
    case "pubmed": return 2000;
    case "ieee": return 3000;
    case "springer": return 4000;
    case "sciencedirect": return 5000;
    case "semanticscholar": return 6000;
    case "biorxiv": return 7000;
    case "nature": return 8000;
    case "science": return 9000;
    default: return 0;
  }
}

/**
 * Check if a paper matches the search query
 */
function paperMatchesQuery(paper: Paper, query: string): boolean {
  const lowercaseQuery = query.toLowerCase();
  return (
    paper.title.toLowerCase().includes(lowercaseQuery) || 
    paper.abstract.toLowerCase().includes(lowercaseQuery) ||
    paper.authors.toLowerCase().includes(lowercaseQuery) ||
    paper.journal.toLowerCase().includes(lowercaseQuery)
  );
}

/**
 * Check if a paper matches the selected subject
 */
function paperMatchesSubject(paper: Paper, subject: string): boolean {
  const lowercaseSubject = subject.toLowerCase();
  return (
    paper.title.toLowerCase().includes(lowercaseSubject) || 
    paper.abstract.toLowerCase().includes(lowercaseSubject) ||
    paper.journal.toLowerCase().includes(lowercaseSubject)
  );
}

/**
 * Get a URL pattern based on the source
 */
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
    case "semanticscholar":
      return `https://www.semanticscholar.org/paper/${6000000 + index}`;
    case "biorxiv":
      return `https://www.biorxiv.org/content/10.1101/${2023 + Math.floor(index / 100)}.${(index % 100).toString().padStart(2, '0')}.${(index % 31 + 1).toString().padStart(2, '0')}.${index}`;
    case "nature":
      return `https://www.nature.com/articles/s${41586 + index}-${2023 + Math.floor(index / 1000)}-${index % 1000}-${index % 10}`;
    case "science":
      return `https://science.org/doi/10.1126/science.${(index * 1357 + 100000).toString()}`;
    default:
      return `https://example.com/papers/${index}`;
  }
}

/**
 * Get a journal name based on the source
 */
function getSourceJournal(source: string, index: number): string {
  const journalsBySource: Record<string, string[]> = {
    arxiv: [
      "arXiv Preprint", 
      "arXiv Computer Science", 
      "arXiv Physics", 
      "arXiv Mathematics"
    ],
    pubmed: [
      "Journal of Medical Research",
      "Biomedical Science",
      "Clinical Reports",
      "Medical Innovations"
    ],
    ieee: [
      "IEEE Transactions on Computing",
      "IEEE Journal of Electrical Engineering",
      "IEEE Communications Magazine",
      "IEEE Systems Journal"
    ],
    springer: [
      "Springer Nature Reviews",
      "Journal of Scientific Computing",
      "Applied Physics Research",
      "Mathematical Programming"
    ],
    sciencedirect: [
      "Advances in Research",
      "Journal of Materials",
      "Computational Science",
      "Environmental Studies"
    ],
    semanticscholar: [
      "Semantic Scholar Database",
      "Journal of Artificial Intelligence",
      "Data Science Review",
      "Computational Linguistics"
    ],
    biorxiv: [
      "bioRxiv Preprint",
      "bioRxiv Genomics",
      "bioRxiv Neuroscience",
      "bioRxiv Immunology"
    ],
    nature: [
      "Nature",
      "Nature Communications",
      "Nature Biotechnology",
      "Nature Methods"
    ],
    science: [
      "Science",
      "Science Advances",
      "Science Translational Medicine",
      "Science Immunology"
    ]
  };
  
  const journals = journalsBySource[source] || ["Journal of Research"];
  return journals[index % journals.length];
}

/**
 * Generate a random publication date
 */
function getRandomDate(): string {
  const year = 2020 + Math.floor(Math.random() * 5);
  const month = 1 + Math.floor(Math.random() * 12);
  const day = 1 + Math.floor(Math.random() * 28);
  return new Date(year, month - 1, day).toISOString().split('T')[0];
}

/**
 * Shuffle an array randomly (Fisher-Yates algorithm)
 */
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
} 