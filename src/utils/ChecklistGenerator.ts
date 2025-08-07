
import { User, OnboardingChecklist, ChecklistItem } from "@/types/User";

export class ChecklistGenerator {
  // Day 1: Welcome & Introduction checklist items
  private day1Tasks: Omit<ChecklistItem, 'id' | 'completed'>[] = [
    {
      title: "Attend orientation session",
      description: "Complete the company orientation and welcome session",
      category: "Administrative",
      priority: "high",
      estimatedTime: 60,
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      title: "Meet team members and manager",
      description: "Introduction meeting with your direct team and manager",
      category: "Meetings",
      priority: "high",
      estimatedTime: 45,
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      title: "Company mission, vision, and values walkthrough",
      description: "Learn about company culture, mission, vision, and core values",
      category: "Learning",
      priority: "high",
      estimatedTime: 30,
    },
    {
      title: "Introduction to buddy/mentor (if applicable)",
      description: "Meet your assigned buddy or mentor for guidance and support",
      category: "Mentorship",
      priority: "medium",
      estimatedTime: 30,
    },
    {
      title: "HR and admin onboarding session",
      description: "Complete HR paperwork, policies, and administrative setup",
      category: "Administrative",
      priority: "high",
      estimatedTime: 45,
    },
    {
      title: "Access to communication tools (Slack, Teams, Zoom, etc.)",
      description: "Set up and configure communication platforms",
      category: "Setup",
      priority: "high",
      estimatedTime: 20,
    },
    {
      title: "Access to internal portals (HRMS, intranet, ticketing system)",
      description: "Get access to internal company systems and portals",
      category: "Setup",
      priority: "high",
      estimatedTime: 30,
    },
    {
      title: "Development tools set up (GitHub, Jira, IDEs)",
      description: "Configure development environment and tools",
      category: "Setup",
      priority: "medium",
      estimatedTime: 60,
    },
    {
      title: "Access to project management tools",
      description: "Set up access to project tracking and management systems",
      category: "Setup",
      priority: "medium",
      estimatedTime: 15,
    },
    {
      title: "Tech stack overview (if technical role)",
      description: "Introduction to technologies and frameworks used",
      category: "Learning",
      priority: "medium",
      estimatedTime: 45,
    },
  ];

  generateChecklist(user: User): OnboardingChecklist {
    const items: ChecklistItem[] = this.day1Tasks.map((task, index) => ({
      ...task,
      id: `${user.id}_task_${index}`,
      completed: false,
    }));

    return {
      id: `checklist_${user.id}`,
      userId: user.id,
      items,
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}
