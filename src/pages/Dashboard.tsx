// File: src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import TaskCard from '@/components/TaskCard';
import checklistData from '@/data/sampleChecklist';
import CountUp from 'react-countup';
import { ChecklistGenerator } from '@/utils/ChecklistGenerator';
import ReactMarkdown from 'react-markdown';
import { ChecklistItem, OnboardingChecklist, User } from '@/types/User';

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

interface GitHubStats {
  commits: number;
  pullRequests: number;
  deployments: number;
  loc: number;
}

const mockUser: User = {
  id: 'user_001',
  name: 'Alex Dev',
  role: 'intern',
  department: 'engineering',
  level: 'junior',
  email: 'alex.dev@example.com',
  startDate: '2024-06-01',
};

const Dashboard2 = () => {
  const [taskList, setTaskList] = useState<ChecklistItem[]>([]);
  const [progress, setProgress] = useState(0);
  const [gistContent, setGistContent] = useState('');
  const [githubStats, setGithubStats] = useState<GitHubStats>({
    commits: 0,
    pullRequests: 0,
    deployments: 0,
    loc:0,
  });
  const [generatedDocs, setGeneratedDocs] = useState('');

  useEffect(() => {
    const generator = new ChecklistGenerator();
    const checklist: OnboardingChecklist = generator.generateChecklist(mockUser);

    setTaskList(checklist.items);
    calculateProgress(checklist.items);
    fetchGist();
    fetchGitHubStats();
  }, []);

  const calculateProgress = (tasks: ChecklistItem[]) => {
    const done = tasks.filter((t) => t.completed).length;
    setProgress(Math.round((done / tasks.length) * 100));
  };

  const fetchGist = async () => {
    try {
      const res = await fetch('https://gist.githubusercontent.com/MASTERxD-2/b2f14800bcf1f8fefcfc5ba7a4e5cade/raw/example.ts');
      const text = await res.text();
      console.log("Fetched Gist content:", text);
      setGistContent(text);
    } catch (err) {
      console.error('Failed to fetch Gist:', err);
    }
  };

  const fetchGitHubStats = async () => {
  try {
    const username = 'MASTERxD-2';
    const repo = 'UNISYNC_';

    const commitsRes = await fetch(`https://api.github.com/repos/${username}/${repo}/commits`);
    const commitsData = await commitsRes.json();

    let totalLOC = 0;
    const activeDates = new Set<string>();

    // Only fetch stats for first N commits to avoid rate limits
    const commitsToCheck = commitsData.slice(0, 10); // You can increase to 30 if needed

    for (const commit of commitsToCheck) {
      const commitRes = await fetch(commit.url);
      const commitDetails = await commitRes.json();

      if (commitDetails.stats) {
        totalLOC += commitDetails.stats.additions + commitDetails.stats.deletions;
      }

      if (commit.commit?.author?.date) {
        const date = new Date(commit.commit.author.date).toDateString();
        activeDates.add(date);
      }
    }

    const pullsRes = await fetch(`https://api.github.com/repos/${username}/${repo}/pulls?state=all`);
    const pullsData = await pullsRes.json();

    const deployments = Math.floor(Math.random() * 10); // Mocked

    setGithubStats({
      commits: commitsData.length,
      pullRequests: pullsData.length,
      deployments,
      loc: totalLOC,
    });
  } catch (err) {
    console.error('Failed to fetch GitHub stats:', err);
  }
};


  const toggleTask = (taskId: string) => {
    const updated = taskList.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTaskList(updated);
    calculateProgress(updated);
  };
  return (
    <div className="min-h-screen bg-white">
  {/* Fixed Header */}
  <header className="fixed top-0 left-0 right-0 z-50 text-gray-600 body-font shadow bg-white h-20">
    <div className="container mx-auto flex items-center justify-between h-full px-6">
      {/* Logo */}
      <a className="flex items-center text-gray-900 font-medium">
        <img src="/logo.png" alt="Synchrony Logo" className="h-12 w-auto" />
        <span className="ml-3 text-2xl font-semibold"></span>
      </a>

      {/* Profile & Logout */}
      <div className="flex items-center space-x-4">
        <img
          src="/profile.png"
          alt="Profile"
          className="h-10 w-10 rounded-full border border-gray-300 object-cover"
        />
        <a href="#" className="inline-block rounded-lg px-4 py-3 text-center text-sm font-semibold text-black outline-none ring-yellow-300 transition duration-100 hover:text-yellow-500 focus-visible:ring active:text-yellow-600 md:text-base">Settings</a>

        <a href="#" className="inline-block rounded-lg bg-yellow-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-yellow-300 transition duration-100 hover:bg-yellow-600 focus-visible:ring active:bg-yellow-700 md:text-base">Logout</a>
      </div>
    </div>
  </header>

  {/* Sidebar */}
  <aside id="default-sidebar" className="hidden sm:block fixed top-20 left-0 z-40 mr-3 w-64 h-[calc(100vh-5rem)] bg-gray-50 dark:bg-black" aria-label="Sidebar">
    <div className="h-full px-3 py-4 overflow-y-auto">
      <ul className="space-y-2 font-medium">
        {/* Sidebar items as-is */}
        <li>
            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
               <svg className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z"/>
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z"/>
               </svg>
               <span className="ms-3">Dashboard</span>
            </a>
         </li>
         <li>
            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
               <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                  <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z"/>
               </svg>
               <span className="flex-1 ms-3 whitespace-nowrap">Kanban</span>
               <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">Pro</span>
            </a>
         </li>
         <li>
            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
               <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z"/>
               </svg>
               <span className="flex-1 ms-3 whitespace-nowrap">Inbox</span>
               <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">3</span>
            </a>
         </li>
         <li>
            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
               <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                  <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"/>
               </svg>
               <span className="flex-1 ms-3 whitespace-nowrap">Users</span>
            </a>
         </li>
         <li>
            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
               <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                  <path d="M17 5.923A1 1 0 0 0 16 5h-3V4a4 4 0 1 0-8 0v1H2a1 1 0 0 0-1 .923L.086 17.846A2 2 0 0 0 2.08 20h13.84a2 2 0 0 0 1.994-2.153L17 5.923ZM7 9a1 1 0 0 1-2 0V7h2v2Zm0-5a2 2 0 1 1 4 0v1H7V4Zm6 5a1 1 0 1 1-2 0V7h2v2Z"/>
               </svg>
               <span className="flex-1 ms-3 whitespace-nowrap">Products</span>
            </a>
         </li>
      </ul>
    </div>
  </aside>
  <main className="pt-20 sm:ml-64 px-6">
    {/* Your actual content goes here */}
    
      <section className="text-gray-600 body-font mt-10 ml-6">
  <div className="container px-5 py-24 mx-auto">
    <div className="flex flex-wrap w-full mb-20 flex-col items-center text-center">
      <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">Welcome Back!</h1>
      <p className="lg:w-1/2 w-full leading-relaxed text-gray-500">Explore active developer projects at Synchrony</p>
    </div>

    <div className="flex flex-wrap -m-4">
      {/* Project 1 */}
      <div className="xl:w-1/3 md:w-1/2 p-4">
        <div className="border border-gray-200 p-6 rounded-lg">
          <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-yellow-100 text-yellow-500 mb-4">
            {/* Icon */}
            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
          </div>
          <h2 className="text-lg text-gray-900 font-medium title-font mb-2">UNISYNC Calendar Integration</h2>
          <p className="leading-relaxed text-base">Automating calendar synchronization for faculty and students across departments with Google Calendar and Outlook APIs.</p>
        </div>
      </div>

      {/* Project 2 */}
      <div className="xl:w-1/3 md:w-1/2 p-4">
        <div className="border border-gray-200 p-6 rounded-lg">
          <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-yellow-100 text-yellow-500 mb-4">
            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
              <circle cx="6" cy="6" r="3"></circle>
              <circle cx="6" cy="18" r="3"></circle>
              <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"></path>
            </svg>
          </div>
          <h2 className="text-lg text-gray-900 font-medium title-font mb-2">Developer Analytics Dashboard</h2>
          <p className="leading-relaxed text-base">Visual dashboard showing commits, PRs, LOC, and deployments across GitHub repos using GitHub GraphQL API.</p>
        </div>
      </div>

      {/* Project 3 */}
      <div className="xl:w-1/3 md:w-1/2 p-4">
        <div className="border border-gray-200 p-6 rounded-lg">
          <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-yellow-100 text-yellow-500 mb-4">
            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <h2 className="text-lg text-gray-900 font-medium title-font mb-2">Real-Time Chat System</h2>
          <p className="leading-relaxed text-base">Socket.IO-powered messaging platform for team communication and project collaboration with notifications.</p>
        </div>
      </div>

      {/* Project 4 */}
      <div className="xl:w-1/3 md:w-1/2 p-4">
        <div className="border border-gray-200 p-6 rounded-lg">
          <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-yellow-100 text-yellow-500 mb-4">
            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"></path>
            </svg>
          </div>
          <h2 className="text-lg text-gray-900 font-medium title-font mb-2">Code Review Engine</h2>
          <p className="leading-relaxed text-base">Automated tool that analyzes PRs, detects code smells, and suggests improvements using OpenAI Codex API.</p>
        </div>
      </div>

      {/* Project 5 */}
      <div className="xl:w-1/3 md:w-1/2 p-4">
        <div className="border border-gray-200 p-6 rounded-lg">
          <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-yellow-100 text-yellow-500 mb-4">
            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
            </svg>
          </div>
          <h2 className="text-lg text-gray-900 font-medium title-font mb-2">Smart Meeting Scheduler</h2>
          <p className="leading-relaxed text-base">AI-powered scheduling tool that finds optimal meeting times based on availability and workload.</p>
        </div>
      </div>

      {/* Project 6 */}
      <div className="xl:w-1/3 md:w-1/2 p-4">
        <div className="border border-gray-200 p-6 rounded-lg">
          <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-yellow-100 text-yellow-500 mb-4">
            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <h2 className="text-lg text-gray-900 font-medium title-font mb-2">CI/CD Pipeline Builder</h2>
          <p className="leading-relaxed text-base">Drag-and-drop interface to configure GitHub Actions or Jenkins pipelines for automated testing and deployment.</p>
        </div>
      </div>
    </div>

    <button className="flex mx-auto mt-16 text-white bg-yellow-500 border-0 py-2 px-8 focus:outline-none hover:bg-yellow-600 rounded text-lg">
      View All Projects
    </button>
  </div>
</section>


<div className="bg-white py-6 sm:py-8 lg:py-12">
  <div className="mx-auto max-w-screen-xl px-4 md:px-8">

    <div className="mb-8 md:mb-12">
      <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">Developer Productivity Stats</h2>
      <p className="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg">Track your tasks and productivity stats below.</p>
    </div>
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-8">

  <div className="flex flex-col items-center justify-center rounded-lg bg-gray-100 p-4 lg:p-8">
    <div className="text-xl font-bold text-yellow-500 sm:text-2xl md:text-3xl">
      <CountUp end={githubStats.commits} duration={1.5} />
    </div>
    <div className="text-sm font-semibold sm:text-base">Commits</div>
  </div>

  <div className="flex flex-col items-center justify-center rounded-lg bg-gray-100 p-4 md:p-8">
    <div className="text-xl font-bold text-yellow-500 sm:text-2xl md:text-3xl">
      <CountUp end={githubStats.deployments} duration={1.5} />
    </div>
    <div className="text-sm font-semibold sm:text-base">Deployments</div>
  </div>

  <div className="flex flex-col items-center justify-center rounded-lg bg-gray-100 p-4 md:p-8">
    <div className="text-xl font-bold text-yellow-500 sm:text-2xl md:text-3xl">
      <CountUp end={githubStats.pullRequests} duration={1.5} />
    </div>
    <div className="text-sm font-semibold sm:text-base">Pull Requests</div>
  </div>

  <div className="flex flex-col items-center justify-center rounded-lg bg-gray-100 p-4 md:p-8">
    <div className="text-xl font-bold text-yellow-500 sm:text-2xl md:text-3xl">
      <CountUp end={githubStats.loc} duration={2.5} separator="," />
    </div>
    <div className="text-sm font-semibold sm:text-base">Lines of Code</div>
  </div>

</div>

  </div>
</div>

<section className="mx-auto max-w-screen-2xl px-4 md:px-8 ">
    <div className="mb-8 flex flex-wrap justify-between md:mb-16">
      <div className="mb-6 flex w-full flex-col justify-center sm:mb-12 lg:mb-0 lg:w-1/3 lg:pb-24 lg:pt-48">
        <h1 className="mb-4 text-4xl font-bold text-black sm:text-5xl md:mb-8 md:text-6xl">Finish your<br />Onboarding</h1>

        <p className="max-w-md leading-relaxed text-gray-500 xl:text-lg">
          Welcome to Synchrony! Our onboarding and preboarding processes are designed to ensure every developer hits the ground running. From setting up your development environment to understanding team workflows and tools, everything is streamlined to help you feel confident and connected from day one.
        </p>
      </div>

      <div className="mb-12 flex w-full md:mb-16 lg:w-2/3">
        <div className="relative left-12 top-12 z-10 -ml-12 overflow-hidden rounded-lg bg-gray-100 shadow-lg md:left-16 md:top-16 lg:ml-0">
          <img src="/onboarding.png" loading="lazy" alt="Onboarding" className="h-full w-full object-cover object-center" />
        </div>

        <div className="overflow-hidden rounded-lg bg-gray-100 shadow-lg">
          <img src="/onboarding_3.png" loading="lazy" alt="Onboarding" className="h-full w-full object-cover object-center" />
        </div>
      </div>
    </div>

    <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
      <div className="flex h-12 w-64 divide-x overflow-hidden rounded-lg border">
        <a href="#" className="flex w-1/2 items-center justify-center bg-yellow-300 text-black transition duration-100 hover:bg-yellow-100 active:bg-yellow">Pre-boarding</a>
        <a href="#" className="flex w-1/2 items-center justify-center bg-yellow-300 text-black transition duration-100 hover:bg-yellow-100 active:bg-yellow">Onboarding</a>
      </div>

      <div className="flex items-center justify-center gap-4 lg:justify-start">
        <span className="text-sm font-semibold uppercase tracking-widest text-gray-400 sm:text-base">Social</span>
        <span className="h-px w-12 bg-gray-200"></span>

        <div className="flex gap-4">
          <a href="#" target="_blank" className="text-gray-400 transition duration-100 hover:text-gray-500 active:text-gray-600">
            <svg className="h-5 w-5" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>

          <a href="#" target="_blank" className="text-gray-400 transition duration-100 hover:text-gray-500 active:text-gray-600">
            <svg className="h-5 w-5" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
            </svg>
          </a>

          <a href="#" target="_blank" className="text-gray-400 transition duration-100 hover:text-gray-500 active:text-gray-600">
            <svg className="h-5 w-5" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.4168 2.4594C17.7648 0.873472 15.4785 0 12.9793 0C9.1616 0 6.81353 1.56493 5.51603 2.87767C3.91693 4.49547 3 6.64362 3 8.77138C3 11.4429 4.11746 13.4934 5.98876 14.2563C6.11439 14.3078 6.24081 14.3337 6.36475 14.3337C6.75953 14.3337 7.07233 14.0754 7.1807 13.661C7.24389 13.4233 7.39024 12.8369 7.45389 12.5823C7.59011 12.0795 7.48005 11.8377 7.18295 11.4876C6.64173 10.8472 6.38969 10.0899 6.38969 9.10438C6.38969 6.17698 8.56948 3.06578 12.6095 3.06578C15.8151 3.06578 17.8064 4.88772 17.8064 7.82052C17.8064 9.67124 17.4077 11.3852 16.6837 12.6468C16.1805 13.5235 15.2957 14.5685 13.9375 14.5685C13.3501 14.5685 12.8225 14.3272 12.4896 13.9066C12.1751 13.5089 12.0714 12.9953 12.1979 12.4599C12.3408 11.855 12.5357 11.2241 12.7243 10.6141C13.0682 9.5001 13.3933 8.44789 13.3933 7.60841C13.3933 6.17252 12.5106 5.20769 11.1969 5.20769C9.52737 5.20769 8.21941 6.90336 8.21941 9.06805C8.21941 10.1297 8.50155 10.9237 8.62929 11.2286C8.41896 12.1197 7.16899 17.4176 6.93189 18.4166C6.79478 18.9997 5.96893 23.6059 7.33586 23.9731C8.87168 24.3858 10.2445 19.8997 10.3842 19.3928C10.4975 18.9806 10.8937 17.4216 11.1365 16.4634C11.878 17.1775 13.0717 17.6603 14.2333 17.6603C16.4231 17.6603 18.3924 16.6749 19.7786 14.8858C21.1229 13.1505 21.8633 10.7318 21.8633 8.0757C21.8632 5.99923 20.9714 3.95209 19.4168 2.4594Z" />
            </svg>
          </a>
        </div>
      </div>
    
    </div>
  </section>
  <div className="bg-white py-6 sm:py-8 lg:py-12">
  <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
  <div className="flex flex-col overflow-hidden rounded-2xl bg-gray-900 shadow-xl sm:flex-row md:h-96">

    {/* Text Content */}
    <div className="flex w-full flex-col justify-between p-6 sm:w-1/2 lg:w-2/5 lg:p-10">
      <h2 className="text-2xl font-extrabold text-white md:text-3xl lg:text-4xl leading-tight">
        Ongoing<br />Project
      </h2>

      <p className="mt-4 mb-6 text-sm text-gray-300 md:text-base lg:text-lg">
        The current project at Synchrony focuses on building a unified developer productivity dashboard. It integrates GitHub activities, deployment pipelines, and collaboration metrics to provide real-time insights that help teams work smarter and deliver faster.
      </p>

      <a
        href="#"
        className="inline-block w-max rounded-md bg-white px-6 py-2.5 text-sm font-semibold text-gray-800 transition duration-200 hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-yellow-300 active:bg-gray-200 md:text-base"
      >
        View Code
      </a>
    </div>

    {/* Image Section */}
    <div className="order-first h-56 w-full sm:order-none sm:h-auto sm:w-1/2 lg:w-3/5">
      <img
        src="/project_2.png"
        loading="lazy"
        alt="Project Image"
        className="h-full w-full object-cover object-center"
      />
    </div>

  </div>
</div>

</div>
  </main>
      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">Welcome Developer!</h1>
          <p className="mb-6 text-gray-600">Here is your personalized onboarding checklist:</p>

          <Progress value={progress} className="mb-4 h-4" />
          <p className="mb-8 text-sm text-gray-700">{progress}% Complete</p>

          <div className="space-y-4">
            {taskList.map(task => (
              <TaskCard key={task.id} task={task} toggle={() => toggleTask(task.id)} />
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white text-gray-600 body-font mt-12">
        <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
          <a className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
            <img src="/logo.png" alt="Synchrony Logo" className="h-10 w-auto" />
            <span className="ml-3 text-xl">Synchrony</span>
          </a>
          <p className="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
            © 2025 Synchrony — <a href="#" className="text-gray-600 ml-1" target="_blank" rel="noopener noreferrer">@Synchrony</a>
          </p>
          <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
            {/* Optional Social Icons */}
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard2;