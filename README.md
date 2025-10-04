# Vertex HKT - AI Chat Application

This is a Next.js starter project built in Firebase Studio that has been customized to function as a dedicated AI Chat application.

## Technical Stack

This project is built with a modern, robust, and scalable technology stack. Below is a detailed breakdown of the key components used in the frontend, backend, and for the generative AI capabilities.

### Frontend

The user interface is a modern web application built with the following technologies:

*   **Framework**: [Next.js](https://nextjs.org/) - A powerful React framework that provides server-side rendering, static site generation, and a seamless developer experience with its App Router.
*   **Language**: [TypeScript](https://www.typescriptlang.org/) - A statically typed superset of JavaScript that enhances code quality, maintainability, and developer productivity.
*   **UI Library**: [React](https://react.dev/) - A declarative, component-based JavaScript library for building user interfaces.
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework that allows for rapid UI development by composing utility classes directly in the markup.
*   **Component Library**: [ShadCN UI](https://ui.shadcn.com/) - A collection of beautifully designed and accessible UI components built on top of Radix UI and Tailwind CSS.
*   **Icons**: [Lucide React](https://lucide.dev/) - A clean and consistent icon library.

### Backend & Authentication

The backend infrastructure and user authentication are handled by Firebase, a comprehensive app development platform from Google.

*   **Platform**: [Firebase](https://firebase.google.com/) - Provides a suite of tools for building web and mobile applications.
*   **Authentication**: [Firebase Authentication](https://firebase.google.com/docs/auth) - Used to handle user sign-in and identity management. This application is configured to use **Google Sign-In** as the sole authentication provider, offering a secure and streamlined login experience for users.

### Generative AI & Language Model (LLM)

The core AI chat functionality is powered by Google's advanced generative AI models, integrated via the Genkit framework.

*   **AI Toolkit**: [Genkit](https://firebase.google.com/docs/genkit) - An open-source framework from Google designed to streamline the development of AI-powered features. It helps in building, deploying, and managing production-ready AI flows.
*   **Language Model (LLM)**: [Google Gemini](https://deepmind.google/technologies/gemini/) - The application utilizes the `gemini-2.5-flash` model, a powerful and efficient model from the Gemini family, to understand user queries and generate human-like responses.
*   **Responsible AI & Content Filtering**: To ensure a safe user experience, the AI is configured with robust safety filters. These filters are set to automatically block harmful or inappropriate content based on the following categories:
    *   **Dangerous Content**: Blocks content flagged as highly dangerous.
    *   **Hate Speech**: Blocks content with a medium-to-high probability of being hate speech.
    *   **Harassment**: Blocks content with a medium-to-high probability of being harassment.
    *   **Sexually Explicit Content**: Blocks content with a medium-to-high probability of being sexually explicit.