
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen } from 'lucide-react';

interface ContentCategorizationFormProps {
  formData: {
    subject: string;
    gradeLevel: string;
    topic: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  isSubmitting: boolean;
  subjects: string[];
  gradeLevels: string[];
  topics: string[]; // This would ideally be filtered by subject
}

export function ContentCategorizationForm({
  formData,
  setFormData,
  isSubmitting,
  subjects,
  gradeLevels,
  topics,
}: ContentCategorizationFormProps) {
  return (
    <div>
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <BookOpen className="h-4 w-4" />
        Categorization
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Subject</Label>
          <Select 
            value={formData.subject} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}
            disabled={isSubmitting}
          >
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
          <Select 
            value={formData.gradeLevel} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, gradeLevel: value }))}
            disabled={isSubmitting}
          >
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
          <Select 
            value={formData.topic} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, topic: value }))}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select topic" />
            </SelectTrigger>
            <SelectContent>
              {/* TODO: Filter topics based on selected subject */}
              {topics.map(topic => (
                <SelectItem key={topic} value={topic}>{topic}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
