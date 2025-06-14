import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Upload, Youtube, BookOpen, Tag, Target, Plus, X, Save, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface FormDataState {
  title: string;
  description: string;
  url: string;
  subject: string;
  gradeLevel: string;
  topic: string;
  difficulty: string;
  concepts: string[];
  contentType: string;
}

const initialFormData: FormDataState = {
  title: '',
  description: '',
  url: '',
  subject: '',
  gradeLevel: '',
  topic: '',
  difficulty: 'medium',
  concepts: [],
  contentType: 'video',
};

export default function UploadContent() {
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormDataState>(initialFormData);
  const [newConcept, setNewConcept] = useState('');

  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Computer Science'];
  const gradeLevels = ['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
  const topics = ['Algebra', 'Geometry', 'Trigonometry', 'Calculus'];
  const difficulties = ['easy', 'medium', 'hard'];
  const contentTypes = ['video', 'document', 'article', 'quiz_link'];

  const addConcept = () => {
    if (newConcept.trim() && !formData.concepts.includes(newConcept.trim())) {
      setFormData(prev => ({
        ...prev,
        concepts: [...prev.concepts, newConcept.trim()]
      }));
      setNewConcept('');
    }
  };

  const removeConcept = (concept: string) => {
    setFormData(prev => ({
      ...prev,
      concepts: prev.concepts.filter(c => c !== concept)
    }));
  };

  const commonSubmitLogic = async (publish: boolean) => {
    if (!user || profile?.role !== 'instructor') {
      toast({
        title: "Authentication Error",
        description: "You must be logged in as an instructor to upload content.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const contentData = {
      instructor_id: user.id,
      title: formData.title,
      description: formData.description,
      url: formData.url,
      content_type: formData.contentType,
      subject: formData.subject,
      grade_level: formData.gradeLevel,
      topic: formData.topic,
      difficulty: formData.difficulty,
      concepts: formData.concepts,
      is_published: publish,
    };

    const { error } = await supabase.from('educational_content').insert([contentData]);

    setIsSubmitting(false);

    if (error) {
      console.error(`Error ${publish ? 'publishing' : 'uploading'} content:`, error);
      toast({
        title: `${publish ? 'Publish' : 'Upload'} Failed`,
        description: `There was an error: ${error.message}`,
        variant: "destructive",
      });
    } else {
      toast({
        title: `Content ${publish ? 'Published' : 'Uploaded'} Successfully`,
        description: `Your educational content has been ${publish ? 'published and is now available' : 'saved as a draft'}.`,
      });
      setFormData(initialFormData);
      setNewConcept('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await commonSubmitLogic(false);
  };
  
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    await commonSubmitLogic(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-700/20 border-green-200 dark:border-green-600/40';
      case 'medium': return 'text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-700/20 border-yellow-200 dark:border-yellow-600/40';
      case 'hard': return 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-700/20 border-red-200 dark:border-red-600/40';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-4">
            <Upload className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">
            Upload Educational Content
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Share your knowledge with students by uploading videos, documents, and educational materials
          </p>
        </div>

        {/* Main Form Card */}
        <Card className="shadow-xl"> {/* Rely on Card's default bg-card and border, custom gradient removed */}
          <CardHeader className="pb-8">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Youtube className="h-6 w-6 text-white" />
              </div>
              Content Details
            </CardTitle>
            <CardDescription className="text-base">
              Provide comprehensive information about your educational content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <form className="space-y-8">
              {/* Basic Information Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium">Content Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Introduction to Linear Equations"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      required
                      disabled={isSubmitting}
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contentType" className="text-sm font-medium">Content Type</Label>
                    <Select
                      value={formData.contentType}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, contentType: value }))}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select content type" />
                      </SelectTrigger>
                      <SelectContent>
                        {contentTypes.map(type => (
                          <SelectItem key={type} value={type}>
                            <div className="flex items-center gap-2">
                              {type === 'video' && <Youtube className="h-4 w-4" />}
                              {type === 'document' && <BookOpen className="h-4 w-4" />}
                              <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url" className="text-sm font-medium">Content URL</Label>
                  <Input
                    id="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={formData.url}
                    onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                    type="url"
                    disabled={isSubmitting}
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what students will learn from this content..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    disabled={isSubmitting}
                    className="text-base resize-none"
                  />
                </div>
              </div>

              <Separator />

              {/* Categorization Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 border-b border-border pb-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  Categorization
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Subject</Label>
                    <Select 
                      value={formData.subject} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map(subject => (
                          <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Grade Level</Label>
                    <Select 
                      value={formData.gradeLevel} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, gradeLevel: value }))}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {gradeLevels.map(grade => (
                          <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Topic</Label>
                    <Select 
                      value={formData.topic} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, topic: value }))}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select topic" />
                      </SelectTrigger>
                      <SelectContent>
                        {topics.map(topic => (
                          <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Concepts & Difficulty Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 border-b border-border pb-2">
                  <Tag className="h-5 w-5 text-purple-600" />
                  Concepts & Difficulty
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">Add Concepts (Tags)</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., Linear Equations"
                        value={newConcept}
                        onChange={(e) => setNewConcept(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addConcept())}
                        disabled={isSubmitting}
                        className="h-12"
                      />
                      <Button 
                        type="button" 
                        onClick={addConcept} 
                        variant="outline" 
                        disabled={isSubmitting}
                        className="h-12 px-6"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {formData.concepts.length > 0 && (
                      <div className="flex flex-wrap gap-2 p-4 bg-muted rounded-lg border border-border">
                        {formData.concepts.map(concept => (
                          <Badge 
                            key={concept} 
                            variant="secondary" 
                            className="cursor-pointer hover:bg-red-100 dark:hover:bg-red-700/30 transition-colors px-3 py-1 text-sm"
                            onClick={() => !isSubmitting && removeConcept(concept)}
                          >
                            {concept}
                            <X className="h-3 w-3 ml-1" />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <Label className="text-sm font-medium">Difficulty Level</Label>
                    <Select 
                      value={formData.difficulty} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {difficulties.map(difficulty => (
                          <SelectItem key={difficulty} value={difficulty}>
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${
                                difficulty === 'easy' ? 'bg-green-500' :
                                difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                              }`} />
                              <span className="capitalize font-medium">{difficulty}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {formData.difficulty && (
                      <div className={`p-4 rounded-lg border ${getDifficultyColor(formData.difficulty)}`}>
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {formData.difficulty === 'easy' && 'Beginner-friendly content'}
                            {formData.difficulty === 'medium' && 'Intermediate level content'}
                            {formData.difficulty === 'hard' && 'Advanced level content'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  className="h-12 px-8 text-base font-medium"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Saving...' : 'Save as Draft'}
                </Button>
                <Button 
                  type="button" 
                  onClick={handlePublish} 
                  disabled={isSubmitting}
                  className="h-12 px-8 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Publishing...' : 'Publish Content'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
