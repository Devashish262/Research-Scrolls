import { useState, useEffect } from "react";
import { PaperCard } from "@/components/paper-card";
import { searchPapers, PAPER_SOURCES } from "@/lib/paper-sources";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Search, RefreshCw, Scroll, Menu, X, Filter, Check } from "lucide-react";
import type { Paper } from "@shared/schema";
import { AnimatePresence, motion } from "framer-motion";

// Available subject categories
const SUBJECTS = [
  "All",
  "AI",
  "Quantum Computing",
  "Climate Science",
  "Biotechnology",
  "Robotics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "Mathematics"
];

export default function Home() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right, 0 for initial
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSources, setActiveSources] = useState<string[]>(PAPER_SOURCES.map(source => source.id));
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Filter papers based on selected subject and sources
  const filteredPapers = papers
    .filter(paper => 
      (selectedSubject === "All" || 
        paper.title.toLowerCase().includes(selectedSubject.toLowerCase()) || 
        paper.abstract.toLowerCase().includes(selectedSubject.toLowerCase()) ||
        paper.journal.toLowerCase().includes(selectedSubject.toLowerCase())
      ) && 
      (activeSources.includes(paper.source || "local"))
    );

  // Get the current paper to display
  const currentPaper = filteredPapers.length > 0 
    ? filteredPapers[currentIndex % filteredPapers.length] 
    : null;

  // Handle search submission
  const handleSearch = async () => {
    if (!searchQuery.trim() && selectedSubject === "All") return;
    
    setLoading(true);
    setIsSearching(true);
    
    try {
      const results = await searchPapers({
        query: searchQuery,
        subject: selectedSubject !== "All" ? selectedSubject : undefined,
        limit: 250
      });
      
      setPapers(results);
      setCurrentIndex(0);
      setDirection(0);
    } catch (error) {
      console.error("Error searching papers:", error);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  // Handle subject selection
  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject);
    setCurrentIndex(0);
    setDirection(0);
  };

  // Toggle a source
  const toggleSource = (sourceId: string) => {
    setActiveSources(prev => {
      if (prev.includes(sourceId)) {
        // Don't allow deselecting all sources
        if (prev.length === 1) return prev;
        return prev.filter(id => id !== sourceId);
      } else {
        return [...prev, sourceId];
      }
    });
    setCurrentIndex(0);
  };

  // Toggle all sources
  const toggleAllSources = () => {
    if (activeSources.length === PAPER_SOURCES.length) {
      // Keep at least one source active
      setActiveSources(["local"]);
    } else {
      setActiveSources(PAPER_SOURCES.map(source => source.id));
    }
    setCurrentIndex(0);
  };

  // Navigate to previous paper with infinite scrolling
  const goToPrevious = () => {
    setDirection(-1);
    if (filteredPapers.length > 0) {
      setCurrentIndex((currentIndex - 1 + filteredPapers.length) % filteredPapers.length);
    }
  };

  // Navigate to next paper with infinite scrolling
  const goToNext = () => {
    setDirection(1);
    if (filteredPapers.length > 0) {
      setCurrentIndex((currentIndex + 1) % filteredPapers.length);
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Load initial papers
  useEffect(() => {
    const loadInitialPapers = async () => {
      setLoading(true);
      try {
        const results = await searchPapers({
          query: "recent",
          limit: 250
        });
        setPapers(results);
      } catch (error) {
        console.error("Error loading initial papers:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialPapers();
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, filteredPapers.length]);

  // Handle swipe gestures
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].clientX;
      handleSwipe();
    };
    
    const handleSwipe = () => {
      const swipeThreshold = 50;
      if (touchStartX - touchEndX > swipeThreshold) {
        // Swipe left, go to next
        goToNext();
      } else if (touchEndX - touchStartX > swipeThreshold) {
        // Swipe right, go to previous
        goToPrevious();
      }
    };
    
    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchend', handleTouchEnd, false);
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentIndex, filteredPapers.length]);

  // Animation variants for the paper cards
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  // Count papers by source
  const sourceStats = papers.reduce((acc, paper) => {
    const source = paper.source || 'local';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen h-screen flex flex-col overflow-hidden bg-black text-white">
      {/* Header with app name and sidebar toggle */}
      <div className="bg-zinc-900 border-b border-zinc-800 py-2 px-4 shrink-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scroll className="h-5 w-5 text-purple-500" />
            <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Research Scrolls
            </h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="text-zinc-400 hover:text-white"
          >
            {sidebarOpen ? <X className="h-4 w-4 mr-1" /> : <Menu className="h-4 w-4 mr-1" />}
            {sidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'}
          </Button>
        </div>
      </div>

      {/* Main content area with sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar with search and filters */}
        <div 
          className={`bg-zinc-900 border-r border-zinc-800 overflow-y-auto transition-all duration-300 ${
            sidebarOpen ? 'w-72' : 'w-0'
          }`}
        >
          <div className="p-4 space-y-4">
            {/* Search input */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Search</h3>
              <div className="flex flex-col gap-2">
                <Input
                  type="text"
                  placeholder="Search for research papers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400 h-9"
                />
                <Button 
                  onClick={handleSearch} 
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  size="sm"
                >
                  {loading ? "Searching..." : "Search"}
                </Button>
              </div>
            </div>
            
            {/* Subject filters */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Subjects</h3>
              <div className="flex flex-col gap-1.5">
                {SUBJECTS.map((subject) => (
                  <Button
                    key={subject}
                    variant={selectedSubject === subject ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleSubjectSelect(subject)}
                    className={`justify-start h-8 ${selectedSubject === subject 
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white border-transparent" 
                      : "bg-transparent border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800"
                    }`}
                  >
                    {subject}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Advanced filters toggle */}
            <div className="pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full justify-between text-zinc-400 hover:text-white"
              >
                <span className="flex items-center gap-1">
                  <Filter className="h-3.5 w-3.5" />
                  Advanced Filters
                </span>
                <span>{showAdvanced ? '−' : '+'}</span>
              </Button>
            </div>
            
            {/* Source filters */}
            {showAdvanced && (
              <div className="space-y-2 pt-1 pb-2 border-t border-zinc-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Sources</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleAllSources}
                    className="h-6 text-xs text-zinc-400 hover:text-white"
                  >
                    {activeSources.length === PAPER_SOURCES.length ? 'Deselect All' : 'Select All'}
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {PAPER_SOURCES.map((source) => (
                    <Button
                      key={source.id}
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSource(source.id)}
                      className={`h-7 justify-start px-2 ${
                        activeSources.includes(source.id)
                          ? "text-purple-300"
                          : "text-zinc-500"
                      }`}
                    >
                      <span className="w-4 h-4 mr-2 flex items-center justify-center border border-zinc-700 rounded-sm bg-zinc-800">
                        {activeSources.includes(source.id) && (
                          <Check className="h-3 w-3 text-purple-400" />
                        )}
                      </span>
                      <span className="text-xs">{source.name}</span>
                    </Button>
                  ))}
                </div>
                
                {/* Source statistics */}
                {Object.keys(sourceStats).length > 0 && (
                  <div className="mt-2 pt-2 border-t border-zinc-800/50">
                    <h4 className="text-xs font-semibold text-zinc-500 mb-1.5">Papers by Source</h4>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                      {PAPER_SOURCES.filter(source => sourceStats[source.id] > 0).map(source => (
                        <div key={source.id} className="flex justify-between text-xs">
                          <span className="text-zinc-400">{source.name}</span>
                          <span className="text-zinc-500">{sourceStats[source.id]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Stats */}
            {filteredPapers.length > 0 && (
              <div className="pt-4 border-t border-zinc-800">
                <p className="text-xs text-zinc-500">
                  Showing {filteredPapers.length} papers
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  Paper {currentIndex + 1} of {filteredPapers.length}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className={`flex-1 relative overflow-hidden ${sidebarOpen ? 'pl-0' : 'pl-0'}`}>
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-500 border-r-transparent"></div>
                <p className="mt-4 text-zinc-400">Searching across multiple research databases...</p>
              </div>
            </div>
          ) : filteredPapers.length > 0 ? (
            <div className="relative h-full">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  className="h-full"
                >
                  {currentPaper && <PaperCard paper={currentPaper} />}
                </motion.div>
              </AnimatePresence>
              
              {/* Navigation buttons - positioned absolutely */}
              <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-4 z-10">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToPrevious}
                  className="rounded-full bg-zinc-800/80 border-zinc-700 text-white hover:bg-zinc-700 h-9 w-9"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="bg-zinc-800/80 backdrop-blur-sm text-zinc-300 px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5">
                  <span>{currentIndex + 1} / {filteredPapers.length}</span>
                  <RefreshCw className="h-2.5 w-2.5 text-zinc-500" />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToNext}
                  className="rounded-full bg-zinc-800/80 border-zinc-700 text-white hover:bg-zinc-700 h-9 w-9"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md mx-auto p-6 bg-zinc-900/50 rounded-lg border border-zinc-800">
                <h2 className="text-xl font-bold mb-2">No papers found</h2>
                <p className="text-zinc-400 mb-4">
                  {isSearching
                    ? `No results found for "${searchQuery}" in ${selectedSubject}`
                    : "Enter a search term or select a subject to find research papers"}
                </p>
                {isSearching && (
                  <Button
                    onClick={() => handleSubjectSelect("All")}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  >
                    View All Papers
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}