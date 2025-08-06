// File: src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import TaskCard from '@/components/TaskCard';
import checklistData from '@/data/sampleChecklist';
import CountUp from 'react-countup';
import { ChecklistGenerator } from '@/utils/ChecklistGenerator';
import ReactMarkdown from 'react-markdown';
import { ChecklistItem, OnboardingChecklist, User } from '@/types/User';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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

const Onboarding = () => {
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
  <Header />

  {/* Sidebar */}
  <Sidebar />
  <main className="pt-20 sm:ml-64 px-6">
    {/* Your actual content goes here */}
    
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
      <Footer />
    </div>
  );
};

export default Onboarding;