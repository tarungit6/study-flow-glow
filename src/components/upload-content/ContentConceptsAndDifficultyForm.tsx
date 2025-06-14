
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tag, Target } from 'lucide-react';

interface ContentConceptsAndDifficultyFormProps {
  formData: {
    concepts: string[];
    difficulty: string;
  };
  newConcept: string;
  setNewConcept: React.Dispatch<React.SetStateAction<string>>;
  addConcept: () => void;
  removeConcept: (concept: string) => void;
  isSubmitting: boolean;
  difficulties: string[];
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export function ContentConceptsAndDifficultyForm({
  formData,
  newConcept,
  setNewConcept,
  addConcept,
  removeConcept,
  isSubmitting,
  difficulties,
  setFormData
}: ContentConceptsAndDifficultyFormProps) {
  return (
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
              disabled={isSubmitting}
            />
            <Button type="button" onClick={addConcept} variant="outline" disabled={isSubmitting}>
              Add
            </Button>
          </div>
          {formData.concepts.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.concepts.map(concept => (
                <Badge key={concept} variant="secondary" className="cursor-pointer" onClick={() => !isSubmitting && removeConcept(concept)}>
                  {concept} ×
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Difficulty Level</Label>
          <Select 
            value={formData.difficulty} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}
            disabled={isSubmitting}
          >
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
  );
}
