
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Youtube, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

import { ContentBasicInfoForm } from '@/components/upload-content/ContentBasicInfoForm';
import { ContentCategorizationForm } from '@/components/upload-content/ContentCategorizationForm';
import { ContentConceptsAndDifficultyForm } from '@/components/upload-content/ContentConceptsAndDifficultyForm';
import { ContentFormActions } from '@/components/upload-content/ContentFormActions';

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
  const topics = ['Algebra', 'Geometry', 'Trigonometry', 'Calculus']; // This would be filtered by subject
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
      setFormData(initialFormData); // Reset form
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
            <form className="space-y-6">
              <ContentBasicInfoForm
                formData={formData}
                setFormData={setFormData}
                isSubmitting={isSubmitting}
                contentTypes={contentTypes}
              />
              
              <Separator />

              <ContentCategorizationForm
                formData={formData}
                setFormData={setFormData}
                isSubmitting={isSubmitting}
                subjects={subjects}
                gradeLevels={gradeLevels}
                topics={topics}
              />

              <Separator />

              <ContentConceptsAndDifficultyForm
                formData={formData}
                setFormData={setFormData}
                newConcept={newConcept}
                setNewConcept={setNewConcept}
                addConcept={addConcept}
                removeConcept={removeConcept}
                isSubmitting={isSubmitting}
                difficulties={difficulties}
              />

              <Separator />

              <ContentFormActions
                handleSubmit={handleSubmit}
                handlePublish={handlePublish}
                isSubmitting={isSubmitting}
              />
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
