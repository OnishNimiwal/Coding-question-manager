
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, CheckCircle, XCircle, Star, Trash2, StickyNote, Edit, Save } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { updateQuestionStatus, deleteQuestion, updateQuestionNotes, toggleQuestionImportance } from '@/firebase/firestore/mutations';

export function MyListCard({ question }: { question: any }) {
  const { toast } = useToast();
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(question.notes || '');

  const getDifficultyBadgeVariant = (difficulty: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (!difficulty) return 'outline';
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'secondary';
      case 'medium': return 'default';
      case 'hard': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'solved': return { variant: 'secondary', icon: <CheckCircle className="h-4 w-4 text-green-500" />, label: 'Solved' };
      case 'unsolved': return { variant: 'destructive', icon: <XCircle className="h-4 w-4 text-red-500" />, label: 'Unsolved' };
      default: return { variant: 'outline', icon: null, label: 'No Status' };
    }
  };

  const statusInfo = getStatusInfo(question.status);

  const handleStatusChange = (newStatus: 'solved' | 'unsolved') => {
    updateQuestionStatus(question.id, newStatus);
    toast({ title: 'Status Updated', description: `Marked "${question.title}" as ${newStatus}.` });
  };

  const handleImportanceToggle = () => {
    toggleQuestionImportance(question.id, !question.isImportant);
    toast({ title: 'Importance Updated' });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this question from your list?')) {
        deleteQuestion(question.id);
        toast({ title: 'Question Removed', variant: 'destructive' });
    }
  };

  const handleSaveNotes = () => {
    updateQuestionNotes(question.id, notes);
    setIsEditingNotes(false);
    toast({ title: 'Notes Saved' });
  };


  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold leading-snug pr-2">{question.title}</CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={handleImportanceToggle}>
                <Star className={`h-5 w-5 transition-colors ${question.isImportant ? 'fill-yellow-400 text-yellow-500' : 'text-muted-foreground hover:text-yellow-400'}`} />
            </Button>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          <Badge variant="outline">{question.platform}</Badge>
          <Badge variant={getDifficultyBadgeVariant(question.difficulty)} className="capitalize">
            {question.difficulty || 'N/A'}
          </Badge>
          <Badge variant={statusInfo.variant} className="capitalize flex items-center gap-1">
            {statusInfo.icon} {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">{question.description}</p>
        <div>
            <div className="flex items-center justify-between mb-2">
                 <h4 className="text-sm font-medium flex items-center gap-1"><StickyNote className="h-4 w-4" /> Notes</h4>
                 {!isEditingNotes && (
                    <Button variant="ghost" size="sm" onClick={() => setIsEditingNotes(true)}>
                        <Edit className="h-4 w-4 mr-2" /> Edit
                    </Button>
                 )}
            </div>
            {isEditingNotes ? (
                <div className="space-y-2">
                     <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add your notes here..." />
                     <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setIsEditingNotes(false)}>Cancel</Button>
                        <Button size="sm" onClick={handleSaveNotes}><Save className="h-4 w-4 mr-2" /> Save</Button>
                     </div>
                </div>
            ) : (
                <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-md min-h-[60px] whitespace-pre-wrap">
                    {question.notes || 'No notes yet.'}
                </p>
            )}
        </div>
      </CardContent>
      <CardFooter className="flex-col space-y-2 items-stretch mt-auto pt-6">
        <Button asChild size="sm" className="w-full">
          <a href={question.link} target="_blank" rel="noopener noreferrer">
            View Question <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
        <div className="flex gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full">
                        Change Status
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleStatusChange('solved')}>
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Mark as Solved
                    </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => handleStatusChange('unsolved')}>
                        <XCircle className="mr-2 h-4 w-4 text-red-500" /> Mark as Unsolved
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="destructive" size="sm" className="w-full" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
