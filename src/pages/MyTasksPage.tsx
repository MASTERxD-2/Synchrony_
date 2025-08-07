import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar  from '@/components/Sidebar';

const tasks = [
  {
    id: 1,
    title: 'Complete Onboarding Checklist',
    date: 'Aug 6, 2025',
    description: 'Finish all the onboarding steps before your first team meeting.',
    image: '/tasks.png',
  },
  {
    id: 2,
    title: 'Team Introduction Call',
    date: 'Aug 7, 2025',
    description: 'Meet your team and introduce yourself in the weekly sync.',
    image: '/tasks.png',
  },
  {
    id: 3,
    title: 'Read Codebase Docs',
    date: 'Aug 8, 2025',
    description: 'Read through the architecture documentation and folder structure.',
    image: '/tasks.png',
  },
  {
    id: 4,
    title: 'Setup Local Dev Environment',
    date: 'Aug 9, 2025',
    description: 'Clone repo, install dependencies and run the dev server.',
    image: '/tasks.png',
  },
  {
    id: 5,
    title: 'Submit First Pull Request',
    date: 'Aug 10, 2025',
    description: 'Push your changes and create a PR for review.',
    image: '/tasks.png',
  },
  {
    id: 6,
    title: 'Review Sprint Board',
    date: 'Aug 11, 2025',
    description: 'Go through the current sprint tasks and update your status.',
    image: '/tasks.png',
  },
  {
    id: 7,
    title: 'Attend Engineering Sync',
    date: 'Aug 12, 2025',
    description: 'Discuss blockers, updates, and share progress with the team.',
    image: '/tasks.png',
  },
  {
    id: 8,
    title: 'Update Profile Info',
    date: 'Aug 13, 2025',
    description: 'Fill out your profile with contact info and a short bio.',
    image: '/tasks.png',
  },
];


const MyTasksPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <Header />
      <Sidebar />

      {/* Main Content */}
      <main className="flex-grow py-6 sm:py-8 lg:py-12">
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8 pt-10">
          {/* Title */}
          <div className="mb-10 md:mb-16 pt-10">
            <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">My Tasks</h2>
            <p className="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg">
              Here are your upcoming tasks. Stay on track and manage your workflow.
            </p>
          </div>

          {/* Tasks Grid */}
          <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-8">
            {tasks.map(task => (
              <div
                key={task.id}
                className="group relative flex h-48 flex-col overflow-hidden rounded-lg bg-gray-100 shadow-lg md:h-64 xl:h-96"
              >
                <img
                src="/tasks3.png"
                alt={task.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110 filter brightness-75"
                />


                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gray-800 to-transparent md:via-transparent"></div>

                <div className="relative mt-auto p-4">
                  <span className="block text-sm text-gray-200">{task.date}</span>
                  <h2 className="mb-1 text-xl font-semibold text-white">{task.title}</h2>
                  <p className="text-sm text-yellow-300">{task.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MyTasksPage;
