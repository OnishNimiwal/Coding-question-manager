# CodeQuery

CodeQuery is a web application designed to help developers find, track, and manage coding problems from various online platforms. It uses AI to search for relevant questions, allows users to save them to a personalized list, and provides a dashboard to visualize their progress.

Built with love with the help of CipherSchools.

## Tech Stack

This project is built with a modern, type-safe, and performant tech stack:

-   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **UI Library**: [React](https://react.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Charts**: [Recharts](https://recharts.org/)
-   **Backend & Database**: [Firebase](https://firebase.google.com/) (Authentication & Firestore)
-   **Generative AI**: [Genkit](https://firebase.google.com/docs/genkit) (with Google's Gemini models)

## Project Structure

The codebase is organized to separate concerns, making it scalable and maintainable.

```
.
├── src
│   ├── app
│   │   ├── (pages)               # Main application routes
│   │   │   ├── layout.tsx        # Root layout
│   │   │   ├── page.tsx          # Landing page
│   │   │   ├── search/page.tsx   # Search page
│   │   │   └── my-list/page.tsx  # User's saved questions list
│   │   ├── actions.ts            # Next.js Server Actions for form handling
│   │   └── globals.css         # Global styles and Tailwind directives
│   │
│   ├── components
│   │   ├── app/                  # High-level application-specific components
│   │   └── ui/                   # Reusable UI components (from ShadCN)
│   │
│   ├── firebase
│   │   ├── auth/use-user.tsx     # Hook for managing the current user's auth state
│   │   ├── firestore/            # Firestore-related hooks and mutations
│   │   ├── client-provider.tsx   # Client-side Firebase initialization provider
│   │   ├── config.ts             # Firebase project configuration
│   │   ├── index.ts              # Barrel file for exporting Firebase utilities
│   │   └── provider.tsx          # Core Firebase context provider
│   │
│   ├── ai
│   │   ├── flows/                # Genkit flows for AI-powered features
│   │   └── genkit.ts             # Genkit initialization and configuration
│   │
│   └── lib
│       ├── utils.ts              # Utility functions (e.g., `cn` for Tailwind)
│       └── placeholder-images.ts # Manages placeholder image data
│
├── docs
│   └── backend.json              # Schema definitions for Firebase entities
│
├── .env                          # Environment variables (ignored by Git)
├── .gitignore                    # Specifies files for Git to ignore
├── firestore.rules               # Firestore security rules
└── next.config.ts                # Next.js configuration
```

## Application Flow

Here is a high-level overview of how a user interaction flows through the application:

1.  **User Searches for a Question** (`src/app/search/page.tsx`):
    -   The user enters a query into the search form.
    -   Submitting the form triggers a Server Action defined in `src/app/actions.ts`.

2.  **AI Finds Relevant Questions** (`src/app/actions.ts` -> `src/ai/flows/find-relevant-coding-questions.ts`):
    -   The `searchAction` calls the `findRelevantCodingQuestions` Genkit flow.
    -   This flow sends a structured prompt to a Google Gemini model, asking it to find coding problems matching the user's query and return them as a structured JSON object.

3.  **Displaying Results** (`src/app/search/page.tsx`):
    -   The Server Action returns the list of questions to the client component.
    -   The results are rendered as `QuestionCard` components.

4.  **Adding a Question to "My List"** (`src/components/app/question-card.tsx` -> `src/firebase/firestore/mutations.ts`):
    -   When the user clicks "Add to List", the `addQuestionToList` function is called.
    -   This function creates a new document in the `userQuestions` collection in Firestore, linking the question to the authenticated user's ID.

5.  **Viewing "My List"** (`src/app/my-list/page.tsx`):
    -   The `MyListPage` component uses the `useUser` and `useCollection` hooks from `src/firebase/` to get the current user and fetch their saved questions from Firestore in real-time.
    -   The dashboard components (charts and stats) derive their data from this collection.
    -   User actions like updating a question's status or adding notes directly call mutation functions in `src/firebase/firestore/mutations.ts`, which update the documents in Firestore.

This flow demonstrates the seamless integration of Next.js features, client-side React components, Firebase for backend services, and Genkit for powerful AI capabilities.

---
*This README was last updated to reflect the current state of the application.*
