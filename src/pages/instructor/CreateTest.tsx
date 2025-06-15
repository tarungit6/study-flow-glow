import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CreateTest() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Create Test</h1>
        <p className="text-muted-foreground">Design assessments and quizzes for your students</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test Details</CardTitle>
          <CardDescription>Enter the basic information for your test</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Test Title</Label>
            <Input id="title" placeholder="Enter test title" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Enter test description" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="course">Course</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="course1">Course 1</SelectItem>
                <SelectItem value="course2">Course 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input id="duration" type="number" min="1" placeholder="Enter test duration" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="passing-score">Passing Score (%)</Label>
            <Input id="passing-score" type="number" min="0" max="100" placeholder="Enter passing score" />
          </div>

          <Button className="w-full">Create Test</Button>
        </CardContent>
      </Card>
    </div>
  );
} 