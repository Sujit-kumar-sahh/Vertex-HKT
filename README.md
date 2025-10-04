# Vertex HKT - AI Chat Application

This is a Next.js starter project built in Firebase Studio that has been customized to function as a dedicated AI Chat application.

<img width="923" height="671" alt="Screenshot 2025-10-04 at 5 26 48 PM" src="https://github.com/user-attachments/assets/32a7bd1d-a2d1-4a5e-b25e-a63db4619eae" />

<img width="941" height="635" alt="Screenshot 2025-10-04 at 5 30 04 PM" src="https://github.com/user-attachments/assets/5e87d457-c84b-41ad-b783-78bc915627ac" />

<img width="935" height="569" alt="Screenshot 2025-10-04 at 5 25 55 PM" src="https://github.com/user-attachments/assets/fec65004-7f5a-4ea9-8d33-0c14fb927123" />

<img width="940" height="591" alt="Screenshot 2025-10-04 at 5 30 29 PM" src="https://github.com/user-attachments/assets/408b1786-3ef8-4344-b59a-5e641e72febf" />



<img width="281" height="301" alt="Screenshot 2025-10-04 at 6 28 22 PM" src="https://github.com/user-attachments/assets/8a3b8de4-dc94-4c89-96cc-4a91e524ff88" />




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
