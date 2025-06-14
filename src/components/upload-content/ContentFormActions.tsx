
import React from 'react';
import { Button } from '@/components/ui/button';

interface ContentFormActionsProps {
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handlePublish: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
}

export function ContentFormActions({ handleSubmit, handlePublish, isSubmitting }: ContentFormActionsProps) {
  return (
    <div className="flex justify-end gap-3">
      <Button type="button" variant="outline" onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save as Draft'}
      </Button>
      <Button type="button" onClick={handlePublish} disabled={isSubmitting}>
        {isSubmitting ? 'Publishing...' : 'Publish Content'}
      </Button>
    </div>
  );
}
