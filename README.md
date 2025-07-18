# Onboarding Portal with Personalized Checklists

A comprehensive onboarding portal that generates personalized checklists based on user roles, departments, and experience levels. Built with React.js, TypeScript, and Tailwind CSS.

## Features

### 🎯 Key Functionalities
- **User Profile Form**: Collects essential user information (name, email, role, department, level)
- **Dynamic Checklist Generation**: Creates personalized onboarding tasks based on user profile
- **Progress Tracking**: Visual progress indicator with completion percentage
- **Task Management**: Check off completed tasks with persistent storage
- **Responsive Design**: Mobile-first design using Tailwind CSS
- **Admin Panel**: Task template management interface

### 🔧 Tech Stack
- **Frontend**: React.js 18, TypeScript
- **Styling**: Tailwind CSS, ShadCN UI components
- **State Management**: React Context API
- **Routing**: React Router DOM
- **Storage**: localStorage for persistence
- **Build Tool**: Vite

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies
npm i

# Step 4: Start the development server with auto-reloading and an instant preview
npm run dev
```

### Usage
1. Open http://localhost:8080 in your browser
2. Choose "Start My Onboarding" to begin the personalized onboarding flow
3. Fill out the profile form with your details
4. View your personalized checklist and track progress
5. Access the admin panel at /admin for task management

## Project Structure

```
src/
├── components/
│   ├── AdminPanel.tsx          # Admin interface for task management
│   ├── OnboardingDashboard.tsx # Main checklist display
│   ├── ProfileForm.tsx         # User profile collection form
│   └── ui/                     # ShadCN UI components
├── contexts/
│   └── AuthContext.tsx         # Authentication context
├── pages/
│   ├── Index.tsx               # Landing page
│   ├── Onboarding.tsx          # Onboarding flow orchestrator
│   └── NotFound.tsx            # 404 page
├── types/
│   └── User.ts                 # User and checklist type definitions
├── utils/
│   └── ChecklistGenerator.ts   # Checklist generation logic
└── App.tsx                     # Main app component
```

## Features in Detail

### Dynamic Checklist Generation
The system generates personalized checklists based on:
- **Role**: Intern vs Full-time Employee
- **Department**: Engineering, Marketing, Sales, HR, Design
- **Level**: Junior, Mid, Senior

### Task Categories
- **Administrative**: HR paperwork, account setup
- **Setup**: Development environment, tools
- **Learning**: Documentation, training materials
- **Meetings**: Team introductions, mentorship
- **Training**: Skill development, certifications
- **Social**: Team connections, culture integration

### Progress Tracking
- Real-time progress calculation
- Visual progress bar
- Task completion persistence
- Congratulations message on completion

## Tech Stack

This project is built with:
- **Vite** - Build tool and development server
- **TypeScript** - Type-safe JavaScript
- **React** - UI framework
- **shadcn-ui** - Component library
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing

## Routes
- `/` - Landing page with navigation options
- `/onboarding` - Personalized onboarding flow
- `/admin` - Admin panel for task management

## Deployment

You can deploy this project using any static hosting service:
- **Vercel**: `npm run build` then deploy the `dist` folder
- **Netlify**: Connect your GitHub repository for automatic deployments
- **GitHub Pages**: Build and deploy to `gh-pages` branch

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
