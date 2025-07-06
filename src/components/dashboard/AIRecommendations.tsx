
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Brain, BookOpen, RotateCcw, Search, RefreshCw, Zap } from "lucide-react";
import { useRecommendations, useDismissRecommendation } from "@/hooks/api/useRecommendations";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function AIRecommendations() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingEmbeddings, setIsGeneratingEmbeddings] = useState(false);
  const { data: recommendations, refetch, isLoading } = useRecommendations();
  const dismissMutation = useDismissRecommendation();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsGenerating(true);
    try {
      await supabase.functions.invoke('generate-recommendations', {
        body: { query: searchQuery }
      });
      refetch();
      setSearchQuery("");
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateEmbeddings = async () => {
    setIsGeneratingEmbeddings(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-embeddings');
      
      if (error) {
        console.error('Error generating embeddings:', error);
        toast.error('Failed to generate embeddings');
      } else {
        console.log('Embeddings generated successfully:', data);
        toast.success(`Successfully generated embeddings! Processed: ${data.processed}, Errors: ${data.errors}`);
      }
    } catch (error) {
      console.error('Error calling generate-embeddings function:', error);
      toast.error('Failed to call embedding generation function');
    } finally {
      setIsGeneratingEmbeddings(false);
    }
  };

  const handleDismiss = (id: string) => {
    dismissMutation.mutate(id);
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'review': return RotateCcw;
      case 'practice': return BookOpen;
      default: return Brain;
    }
  };

  const displayRecommendations = recommendations?.length ? recommendations : [
    {
      id: 'default-1',
      title: "Get Started with Learning",
      description: "Search for topics you're interested in to get personalized AI recommendations!",
      recommendation_type: "explore",
      priority: 1,
      action_url: null,
      is_dismissed: false,
      created_at: new Date().toISOString(),
      expires_at: null,
      user_id: null
    }
  ];

  const getPriorityColor = (priority: number) => {
    if (priority === 1) return "destructive";
    if (priority === 2) return "default";
    return "secondary";
  };

  const getPriorityLabel = (priority: number) => {
    if (priority === 1) return "High";
    if (priority === 2) return "Medium";
    return "Low";
  };

  return (
    <Card className="gradient-card border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          AI Recommendations
        </CardTitle>
        <div className="flex gap-2 mt-4">
          <div className="flex-1">
            <Input
              placeholder="Search for topics (e.g., javascript, calculus, chemistry)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={!searchQuery.trim() || isGenerating}
            size="sm"
            className="gradient-primary border-0 text-white"
          >
            {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </Button>
          <Button 
            onClick={generateEmbeddings}
            disabled={isGeneratingEmbeddings}
            variant="outline"
            size="sm"
            className="border-primary/20"
          >
            {isGeneratingEmbeddings ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Zap className="w-4 h-4 mr-2" />
            )}
            {isGeneratingEmbeddings ? 'Generating...' : 'Generate AI Embeddings'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading recommendations...
          </div>
        ) : (
          displayRecommendations.map((rec, index) => {
            const IconComponent = getTypeIcon(rec.recommendation_type);
            return (
              <div key={rec.id || index} className="p-4 rounded-lg bg-background/50 hover:bg-background/70 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="gradient-primary rounded-full p-2 flex-shrink-0">
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{rec.title}</h4>
                      <div className="flex items-center gap-2">
                        {rec.priority && (
                          <Badge variant={getPriorityColor(rec.priority)} className="text-xs">
                            {getPriorityLabel(rec.priority)}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">15 min</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {rec.recommendation_type}
                      </Badge>
                      <div className="flex gap-2">
                        {rec.action_url && (
                          <Button size="sm" className="gradient-primary border-0 text-white">
                            Start Learning
                          </Button>
                        )}
                        {rec.id !== 'default-1' && (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleDismiss(rec.id)}
                            className="text-xs"
                          >
                            Dismiss
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
