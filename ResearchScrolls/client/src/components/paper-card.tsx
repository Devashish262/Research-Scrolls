import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Paper } from "@shared/schema";
import { ExternalLink, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// Function to extract subject from paper title
function extractSubject(title: string): string | null {
  const match = title.match(/^([^:]+) Research:/);
  return match ? match[1] : null;
}

// Function to validate and clean abstract text
function cleanAbstract(abstract: string | undefined): string {
  if (!abstract || abstract.trim() === '' || 
      abstract === 'No abstract available' || 
      abstract === 'Abstract not available') {
    return '';
  }
  
  // Remove any HTML tags that might be present
  const cleanedText = abstract
    .replace(/<[^>]*>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
    
  return cleanedText.trim();
}

export interface PaperCardProps {
  paper: Paper;
}

export function PaperCard({ paper }: PaperCardProps) {
  // Extract subject from title if possible
  const subject = extractSubject(paper.title);
  // Clean the title - remove the subject prefix if it exists
  const cleanTitle = subject 
    ? paper.title.replace(/^[^:]+: /, '') 
    : paper.title;
    
  // Clean and validate the abstract
  const abstractText = cleanAbstract(paper.abstract);
  const hasValidAbstract = abstractText.length > 0;

  return (
    <div className="w-full h-full flex items-center justify-center p-2">
      <Card className="w-full max-w-2xl mx-auto bg-zinc-900 border-zinc-800 text-zinc-100 shadow-xl overflow-hidden flex flex-col h-[calc(100vh-10rem)]">
        {/* Header with gradient background */}
        <div className="relative h-12 bg-gradient-to-r from-purple-900 to-blue-900 flex items-center px-4 shrink-0">
          <div className="flex gap-2">
            {subject && (
              <Badge variant="outline" className="bg-zinc-800/50 text-white border-zinc-700">
                {subject}
              </Badge>
            )}
            <Badge variant="secondary" className="bg-zinc-800/50 text-white border-zinc-700">
              {paper.source || "local"}
            </Badge>
          </div>
          <div className="ml-auto text-xs text-zinc-300">
            {paper.journal} • {paper.publishedDate}
          </div>
        </div>
        
        {/* Paper title and authors */}
        <CardHeader className="pb-2 pt-3 shrink-0">
          <CardTitle className="text-xl font-bold text-white leading-tight">
            {cleanTitle}
          </CardTitle>
          <CardDescription className="text-zinc-400 mt-1 text-sm">
            {paper.authors}
          </CardDescription>
        </CardHeader>
        
        {/* Main content area with fixed layout */}
        <CardContent className="flex flex-col flex-1 overflow-hidden pb-3 pt-0">
          {/* Abstract section with auto-sizing */}
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar mb-3">
            <div>
              <h4 className="text-sm font-medium text-zinc-300 mb-1">Abstract</h4>
              {hasValidAbstract ? (
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {abstractText}
                </p>
              ) : (
                <div className="flex items-center gap-2 p-3 rounded-md bg-zinc-800/50 border border-zinc-700">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <p className="text-sm text-zinc-400">
                    No abstract available for this paper.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Footer section with button - always visible */}
          <div className="mt-auto pt-3 pb-6 border-t border-zinc-800 shrink-0">
            <Button 
              variant="default" 
              size="sm"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              asChild
            >
              <a href={paper.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                Read Full Paper <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}