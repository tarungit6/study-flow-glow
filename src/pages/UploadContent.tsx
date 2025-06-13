
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
import { Youtube, Upload, Tag, BookOpen, GraduationCap, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function UploadContent() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    subject: '',
    gradeLevel: '',
    topic: '',
    difficulty: 'medium',
    concepts: [] as string[]
  });
  const [newConcept, setNewConcept] = useState('');

  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Computer Science'];
  const gradeLevels = ['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
  const topics = ['Algebra', 'Geometry', 'Trigonometry', 'Calculus']; // This would be filtered by subject
  const difficulties = ['easy', 'medium', 'hard'];

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here we would submit to the backend
    toast({
      title: "Content Uploaded Successfully",
      description: "Your educational content has been added and is now available to students.",
    });
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      url: '',
      subject: '',
      gradeLevel: '',
      topic: '',
      difficulty: 'medium',
      concepts: []
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Upload Educational Content</h1>
            <p className="text-muted-foreground">Add YouTube videos and educational materials for your students</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Youtube className="h-5 w-5 text-red-600" />
              Content Details
            </CardTitle>
            <CardDescription>
              Provide information about your educational content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Content Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Introduction to Linear Equations"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url">YouTube URL</Label>
                  <Input
                    id="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={formData.url}
                    onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what students will learn from this content..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <Separator />

              {/* Categorization */}
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Categorization
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Select value={formData.subject} onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}>
                      <SelectTrigger>
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
                    <Label>Grade Level</Label>
                    <Select value={formData.gradeLevel} onValueChange={(value) => setFormData(prev => ({ ...prev, gradeLevel: value }))}>
                      <SelectTrigger>
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
                    <Label>Topic</Label>
                    <Select value={formData.topic} onValueChange={(value) => setFormData(prev => ({ ...prev, topic: value }))}>
                      <SelectTrigger>
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

              {/* Concepts and Difficulty */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Concepts & Difficulty
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Add Concepts (Tags)</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., Linear Equations"
                        value={newConcept}
                        onChange={(e) => setNewConcept(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addConcept())}
                      />
                      <Button type="button" onClick={addConcept} variant="outline">
                        Add
                      </Button>
                    </div>
                    {formData.concepts.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.concepts.map(concept => (
                          <Badge key={concept} variant="secondary" className="cursor-pointer" onClick={() => removeConcept(concept)}>
                            {concept} ×
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Difficulty Level</Label>
                    <Select value={formData.difficulty} onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {difficulties.map(difficulty => (
                          <SelectItem key={difficulty} value={difficulty}>
                            <div className="flex items-center gap-2">
                              <Target className={`h-3 w-3 ${
                                difficulty === 'easy' ? 'text-green-500' :
                                difficulty === 'medium' ? 'text-yellow-500' : 'text-red-500'
                              }`} />
                              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Submit */}
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline">Save as Draft</Button>
                <Button type="submit">Publish Content</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
