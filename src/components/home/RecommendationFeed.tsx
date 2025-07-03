import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Sparkles, Filter, X } from "lucide-react";
import { useRecommendations } from "@/hooks/api/useRecommendations";
import { LessonCard } from "./LessonCard";

export function RecommendationFeed() {
  const [query, setQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    filter_difficulty: '',
    filter_grade_level: '',
    match_count: 12,
  });

  const { data: recommendations, isLoading, error } = useRecommendations(searchQuery, filters);

  const handleSearch = () => {
    setSearchQuery(query);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearFilters = () => {
    setFilters({
      filter_difficulty: '',
      filter_grade_level: '',
      match_count: 12,
    });
  };

  const hasActiveFilters = filters.filter_difficulty || filters.filter_grade_level;

  const suggestedQueries = [
    "JavaScript fundamentals",
    "Data structures and algorithms", 
    "Machine learning basics",
    "React hooks tutorial",
    "Python for beginners",
    "Database design principles"
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
          Recommended for You
        </h1>
        <p className="text-muted-foreground">
          Discover lessons tailored to your learning goals and interests
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl">
        <CardContent className="p-6 space-y-4">
          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="What would you like to learn? (e.g., 'Python loops', 'React components')"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 pr-4 py-3 text-lg border-white/30 dark:border-slate-700/30 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl"
              />
            </div>
            <Button 
              onClick={handleSearch}
              disabled={!query.trim()}
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white border-0 rounded-xl"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Find Lessons
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            <Select 
              value={filters.filter_difficulty} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, filter_difficulty: value }))}
            >
              <SelectTrigger className="w-36 border-white/30 dark:border-slate-700/30 bg-white/60 dark:bg-slate-800/60">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={filters.filter_grade_level} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, filter_grade_level: value }))}
            >
              <SelectTrigger className="w-40 border-white/30 dark:border-slate-700/30 bg-white/60 dark:bg-slate-800/60">
                <SelectValue placeholder="Grade Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Grades</SelectItem>
                <SelectItem value="elementary">Elementary</SelectItem>
                <SelectItem value="middle">Middle School</SelectItem>
                <SelectItem value="high">High School</SelectItem>
                <SelectItem value="college">College</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-3 h-3 mr-1" />
                Clear
              </Button>
            )}
          </div>

          {/* Suggested Queries */}
          {!searchQuery && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Try searching for:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQueries.map((suggestion) => (
                  <Badge
                    key={suggestion}
                    variant="outline"
                    className="cursor-pointer hover:bg-teal-500/20 hover:border-teal-500/50 transition-colors"
                    onClick={() => {
                      setQuery(suggestion);
                      setSearchQuery(suggestion);
                    }}
                  >
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {searchQuery && (
        <div className="space-y-4">
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Search Results for "{searchQuery}"
            </h2>
            {recommendations && (
              <Badge variant="outline" className="bg-white/60 dark:bg-slate-800/60">
                {recommendations.length} lessons found
              </Badge>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-video w-full" />
                  <CardContent className="p-4 space-y-3">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <Card className="border-destructive/50 bg-destructive/5">
              <CardContent className="p-6 text-center">
                <p className="text-destructive">
                  Failed to load recommendations. Please try again.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Recommendations Grid */}
          {recommendations && recommendations.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recommendations.map((lesson) => (
                <LessonCard
                  key={lesson.lesson_id}
                  lesson={lesson}
                  showSimilarity={true}
                />
              ))}
            </div>
          )}

          {/* No Results */}
          {recommendations && recommendations.length === 0 && !isLoading && (
            <Card className="border-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl">
              <CardContent className="p-12 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center">
                  <Search className="w-8 h-8 text-teal-400" />
                </div>
                <h3 className="text-lg font-semibold">No lessons found</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  We couldn't find any lessons matching your search. Try different keywords or browse our course catalog.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setQuery('');
                    setSearchQuery('');
                  }}
                  className="border-white/30 dark:border-slate-700/30 bg-white/60 dark:bg-slate-800/60"
                >
                  Clear Search
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}