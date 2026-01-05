
'use client';

import { getFirestore, doc, setDoc, addDoc, collection, serverTimestamp, updateDoc, deleteDoc } from 'firebase/firestore';
import type { FindRelevantCodingQuestionsOutput } from '@/ai/flows/find-relevant-coding-questions';

type CodingQuestion = FindRelevantCodingQuestionsOutput[0];

// Function to add a question to a user's list
export const addQuestionToList = (userId: string, question: CodingQuestion) => {
    const db = getFirestore();
    const questionsCollection = collection(db, 'userQuestions');
    addDoc(questionsCollection, {
        ...question,
        userId: userId,
        status: 'unsolved',
        isImportant: false,
        notes: '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
};

// Function to update the status of a question
export const updateQuestionStatus = (questionId: string, status: 'solved' | 'unsolved') => {
    const db = getFirestore();
    const questionRef = doc(db, 'userQuestions', questionId);
    updateDoc(questionRef, {
        status: status,
        updatedAt: serverTimestamp(),
    });
};

// Function to toggle the importance of a question
export const toggleQuestionImportance = (questionId: string, isImportant: boolean) => {
    const db = getFirestore();
    const questionRef = doc(db, 'userQuestions', questionId);
    updateDoc(questionRef, {
        isImportant: isImportant,
        updatedAt: serverTimestamp(),
    });
};


// Function to update notes for a question
export const updateQuestionNotes = (questionId: string, notes: string) => {
    const db = getFirestore();
    const questionRef = doc(db, 'userQuestions', questionId);
    updateDoc(questionRef, {
        notes: notes,
        updatedAt: serverTimestamp(),
    });
};

// Function to delete a question from a user's list
export const deleteQuestion = (questionId: string) => {
    const db = getFirestore();
    const questionRef = doc(db, 'userQuestions', questionId);
    deleteDoc(questionRef);
};

// Function to create or update a user profile
export const updateUserProfile = (user: any) => {
  if (!user) return;
  const db = getFirestore();
  const userRef = doc(db, 'users', user.uid);
  setDoc(userRef, {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  }, { merge: true });
};
