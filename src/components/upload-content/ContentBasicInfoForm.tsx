
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ContentBasicInfoFormProps {
  formData: {
    title: string;
    url: string;
    contentType: string;
    description: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>; // Consider a more specific type
  isSubmitting: boolean;
  contentTypes: string[];
}

export function ContentBasicInfoForm({
  formData,
  setFormData,
  isSubmitting,
  contentTypes,
}: ContentBasicInfoFormProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Content Title</Label>
          <Input
            id="title"
            placeholder="e.g., Introduction to Linear Equations"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="url">Content URL (e.g., YouTube)</Label>
          <Input
            id="url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={formData.url}
            onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
            type="url"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="contentType">Content Type</Label>
        <Select
          value={formData.contentType}
          onValueChange={(value) => setFormData(prev => ({ ...prev, contentType: value }))}
          disabled={isSubmitting}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select content type" />
          </SelectTrigger>
          <SelectContent>
            {contentTypes.map(type => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe what students will learn from this content..."
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          disabled={isSubmitting}
        />
      </div>
    </>
  );
}
