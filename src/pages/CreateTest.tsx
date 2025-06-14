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
import { Plus, FileText, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/auth/useAuth';
import { useQuizzes } from '@/hooks/api/useQuizzes';
import { Database } from '@/integrations/supabase/types';

type QuizDefinitionInsert = Database['public']['Tables']['quiz_definitions']['Insert'];
type QuizQuestionInsert = Database['public']['Tables']['quiz_questions']['Insert'];

interface Question {
  id: string; // client-side ID
  text: string;
  type: 'multiple_choice' | 'true_false';
  options: string[];
  correctAnswer: string;
  explanation: string;
  marks: number;
  concept: string;
}

const initialTestData = {
  title: '',
  description: '',
  subject: '',
  gradeLevel: '',
  topic: '',
  difficulty: 'medium',
  timeLimit: 60,
  instructions: ''
};

const initialCurrentQuestion: Partial<Question> = {
  text: '',
  type: 'multiple_choice',
  options: ['', '', '', ''],
  correctAnswer: '',
  explanation: '',
  marks: 1,
  concept: ''
};

export default function CreateTest() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { createQuiz, isLoading: isSubmittingQuiz } = useQuizzes(user?.id);

  const [testData, setTestData] = useState(initialTestData);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>(initialCurrentQuestion);

  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Computer Science'];
  const gradeLevels = ['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
  const topics = ['Algebra', 'Geometry', 'Trigonometry', 'Calculus'];
  const concepts = ['Linear Equations', 'Quadratic Equations', 'Factoring', 'Systems of Equations'];

  const addQuestion = () => {
    if (!currentQuestion.text || !currentQuestion.correctAnswer) {
      toast({
        title: "Error",
        description: "Please fill in the question text and correct answer.",
        variant: "destructive"
      });
      return;
    }

    const newQuestion: Question = {
      id: Date.now().toString(),
      text: currentQuestion.text!,
      type: currentQuestion.type!,
      options: currentQuestion.type === 'multiple_choice' ? currentQuestion.options! : ['True', 'False'],
      correctAnswer: currentQuestion.correctAnswer!,
      explanation: currentQuestion.explanation || '',
      marks: currentQuestion.marks || 1,
      concept: currentQuestion.concept || ''
    };

    setQuestions(prev => [...prev, newQuestion]);
    setCurrentQuestion(initialCurrentQuestion);

    toast({
      title: "Question Added",
      description: "Question has been added to the test.",
    });
  };

  const removeQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const updateQuestionOption = (index: number, value: string) => {
    const newOptions = [...(currentQuestion.options || ['', '', '', ''])];
    newOptions[index] = value;
    setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
  };

  const handleFormSubmit = async (publish: boolean) => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to create a test.", variant: "destructive" });
      return;
    }
    if (!testData.title.trim()) {
      toast({ title: "Error", description: "Test title is required.", variant: "destructive" });
      return;
    }
    if (questions.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one question to the test.",
        variant: "destructive"
      });
      return;
    }

    const quizPayload: Omit<QuizDefinitionInsert, 'created_by' | 'id' | 'created_at' | 'updated_at'> = {
      title: testData.title,
      description: testData.description || null,
      subject: testData.subject || null,
      grade_level: testData.gradeLevel || null,
      topic: testData.topic || null,
      difficulty: testData.difficulty || null,
      time_limit_minutes: testData.timeLimit,
      instructions: testData.instructions || null,
      status: publish ? 'published' : 'draft',
    };

    const questionsPayload: Omit<QuizQuestionInsert, 'quiz_id' | 'id' | 'created_at'>[] = questions.map((q, index) => ({
      question_text: q.text,
      question_type: q.type,
      options: q.options,
      correct_answer: q.correctAnswer,
      explanation: q.explanation || null,
      points: q.marks,
      concept: q.concept || null,
      order_index: index,
    }));
    
    console.log('Submitting quiz:', quizPayload);
    console.log('Submitting questions:', questionsPayload);

    try {
      await createQuiz.mutateAsync({ quiz: quizPayload, questions: questionsPayload });
      setTestData(initialTestData);
      setQuestions([]);
      setCurrentQuestion(initialCurrentQuestion);
    } catch (error) {
      console.error("Failed to create test:", error);
    }
  };


  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Create Test</h1>
            <p className="text-muted-foreground">Design assessments and quizzes for your students</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Configuration</CardTitle>
              <CardDescription>Set up the basic details for your test</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="testTitle">Test Title</Label>
                  <Input
                    id="testTitle"
                    placeholder="e.g., Algebra Fundamentals Quiz"
                    value={testData.title}
                    onChange={(e) => setTestData(prev => ({ ...prev, title: e.target.value }))}
                    disabled={isSubmittingQuiz}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="testDescription">Description</Label>
                  <Textarea
                    id="testDescription"
                    placeholder="Brief description of the test..."
                    value={testData.description}
                    onChange={(e) => setTestData(prev => ({ ...prev, description: e.target.value }))}
                    rows={2}
                    disabled={isSubmittingQuiz}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Select 
                      value={testData.subject} 
                      onValueChange={(value) => setTestData(prev => ({ ...prev, subject: value }))}
                      disabled={isSubmittingQuiz}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
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
                      value={testData.gradeLevel} 
                      onValueChange={(value) => setTestData(prev => ({ ...prev, gradeLevel: value }))}
                      disabled={isSubmittingQuiz}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {gradeLevels.map(grade => (
                          <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Topic</Label>
                    <Select 
                      value={testData.topic} 
                      onValueChange={(value) => setTestData(prev => ({ ...prev, topic: value }))}
                      disabled={isSubmittingQuiz}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {topics.map(topic => (
                          <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Difficulty</Label>
                    <Select 
                      value={testData.difficulty} 
                      onValueChange={(value) => setTestData(prev => ({ ...prev, difficulty: value }))}
                      disabled={isSubmittingQuiz}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Time Limit (minutes)</Label>
                  <Input
                    type="number"
                    value={testData.timeLimit}
                    onChange={(e) => setTestData(prev => ({ ...prev, timeLimit: parseInt(e.target.value) || 60 }))}
                    disabled={isSubmittingQuiz}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Instructions</Label>
                  <Textarea
                    placeholder="Special instructions for students..."
                    value={testData.instructions}
                    onChange={(e) => setTestData(prev => ({ ...prev, instructions: e.target.value }))}
                    rows={2}
                    disabled={isSubmittingQuiz}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add Question</CardTitle>
              <CardDescription>Create a new question for your test</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Question Text</Label>
                <Textarea
                  placeholder="Enter your question..."
                  value={currentQuestion.text}
                  onChange={(e) => setCurrentQuestion(prev => ({ ...prev, text: e.target.value }))}
                  rows={2}
                  disabled={isSubmittingQuiz}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Question Type</Label>
                  <Select 
                    value={currentQuestion.type} 
                    onValueChange={(value: 'multiple_choice' | 'true_false') => 
                      setCurrentQuestion(prev => ({ 
                        ...prev, 
                        type: value,
                        options: value === 'multiple_choice' ? prev.options?.length === 4 ? prev.options : ['', '', '', ''] : ['True', 'False'],
                        correctAnswer: '' 
                      }))
                    }
                    disabled={isSubmittingQuiz}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                      <SelectItem value="true_false">True/False</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Marks</Label>
                  <Input
                    type="number"
                    min="1"
                    value={currentQuestion.marks}
                    onChange={(e) => setCurrentQuestion(prev => ({ ...prev, marks: parseInt(e.target.value) || 1 }))}
                    disabled={isSubmittingQuiz}
                  />
                </div>
              </div>

              {currentQuestion.type === 'multiple_choice' && (
                <div className="space-y-2">
                  <Label>Answer Options</Label>
                  {currentQuestion.options?.map((option, index) => (
                    <Input
                      key={index}
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => updateQuestionOption(index, e.target.value)}
                      disabled={isSubmittingQuiz}
                    />
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <Label>Correct Answer</Label>
                {currentQuestion.type === 'multiple_choice' ? (
                  <Select 
                    value={currentQuestion.correctAnswer} 
                    onValueChange={(value) => setCurrentQuestion(prev => ({ ...prev, correctAnswer: value }))}
                    disabled={isSubmittingQuiz || !currentQuestion.options?.some(opt => opt.trim() !== '')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select correct answer" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentQuestion.options?.map((option, index) => 
                        option && option.trim() !== '' && (
                          <SelectItem key={index} value={option}>
                            {option}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                ) : ( 
                  <Select 
                    value={currentQuestion.correctAnswer} 
                    onValueChange={(value) => setCurrentQuestion(prev => ({ ...prev, correctAnswer: value }))}
                    disabled={isSubmittingQuiz}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select correct answer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="True">True</SelectItem>
                      <SelectItem value="False">False</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-2">
                <Label>Concept (Optional)</Label>
                <Select 
                  value={currentQuestion.concept} 
                  onValueChange={(value) => setCurrentQuestion(prev => ({ ...prev, concept: value }))}
                  disabled={isSubmittingQuiz}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select concept" />
                  </SelectTrigger>
                  <SelectContent>
                    {concepts.map(concept => (
                      <SelectItem key={concept} value={concept}>{concept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Explanation (Optional)</Label>
                <Textarea
                  placeholder="Explain the correct answer..."
                  value={currentQuestion.explanation}
                  onChange={(e) => setCurrentQuestion(prev => ({ ...prev, explanation: e.target.value }))}
                  rows={2}
                  disabled={isSubmittingQuiz}
                />
              </div>

              <Button onClick={addQuestion} className="w-full" disabled={isSubmittingQuiz}>
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </CardContent>
          </Card>
        </div>

        {questions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Test Questions ({questions.length})</CardTitle>
              <CardDescription>Review and manage your test questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">Q{index + 1}</Badge>
                          <Badge variant="secondary">{question.marks} mark{question.marks > 1 ? 's' : ''}</Badge>
                          {question.concept && <Badge variant="outline">{question.concept}</Badge>}
                        </div>
                        <p className="font-medium mb-2">{question.text}</p>
                        
                        {question.type === 'multiple_choice' ? (
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            {question.options.map((option, optIndex) => (
                              <div key={optIndex} className={`p-2 rounded ${
                                option === question.correctAnswer 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-700/20 dark:text-green-300' 
                                  : 'bg-muted'
                              }`}>
                                {String.fromCharCode(65 + optIndex)}. {option}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm">
                            <span className={`px-2 py-1 rounded ${
                              question.correctAnswer === 'True' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-700/20 dark:text-green-300' 
                                : 'bg-red-100 text-red-800 dark:bg-red-700/20 dark:text-red-300'
                            }`}>
                              Correct Answer: {question.correctAnswer}
                            </span>
                          </div>
                        )}
                        
                        {question.explanation && (
                          <p className="text-sm text-muted-foreground mt-2">
                            <strong>Explanation:</strong> {question.explanation}
                          </p>
                        )}
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuestion(question.id)}
                        className="text-red-600 hover:text-red-700"
                        disabled={isSubmittingQuiz}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Total Questions: {questions.length} | Total Marks: {questions.reduce((sum, q) => sum + q.marks, 0)}
                </div>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => handleFormSubmit(false)} 
                    disabled={isSubmittingQuiz || questions.length === 0 || !testData.title.trim()}
                  >
                    {isSubmittingQuiz ? 'Saving...' : 'Save as Draft'}
                  </Button>
                  <Button 
                    onClick={() => handleFormSubmit(true)} 
                    disabled={isSubmittingQuiz || questions.length === 0 || !testData.title.trim()}
                  >
                    {isSubmittingQuiz ? 'Publishing...' : 'Publish Test'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
