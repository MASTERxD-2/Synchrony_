import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import React from "react";

const ViewProjects = () => {
  return (
    <div className="bg-white py-6 sm:py-8 lg:py-12">
        <Header />
        <Sidebar />
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        {/* text - start */}
        <div className="mb-10 md:mb-16">
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">
            Explore Project Summaries
          </h2>

          <p className="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg">
            Browse through automatically generated summaries of uploaded projects — including folder structure, languages used, key features, and setup instructions.
          </p>
        </div>
        {/* text - end */}

        <div className="grid gap-4 sm:grid-cols-2 md:gap-8 xl:grid-cols-3">
          {/* Example project - replace with actual data later */}
          {[
            {
              title: "Onboarding Portal",
              description:
                "A React.js app that generates personalized onboarding checklists with dynamic tasks and role-based flows.",
            },
            {
              title: "DevOps Dashboard",
              description:
                "Monitors deployment pipelines and GitHub activity for real-time productivity insights.",
            },
            {
              title: "E-commerce Backend",
              description:
                "A scalable Django-based backend with secure APIs and PostgreSQL database integration.",
            },
            {
              title: "AI Resume Parser",
              description:
                "Parses uploaded resumes using NLP and matches candidates with job roles using cosine similarity.",
            },
            {
              title: "Fitness Tracker App",
              description:
                "A mobile-first fitness app using React Native and Firebase for real-time health data logging.",
            },
            {
              title: "Portfolio Website",
              description:
                "A personal portfolio built with Next.js, showcasing projects and blog posts with MDX.",
            },
          ].map((project, index) => (
            <div
              key={index}
              className="flex flex-col rounded-lg border p-4 md:p-6"
            >
              <h3 className="mb-2 text-lg font-semibold md:text-xl">
                {project.title}
              </h3>
              <p className="mb-4 text-gray-500">{project.description}</p>
              <a
                href="#"
                className="mt-auto font-bold text-yellow-500 transition duration-100 hover:text-yellow-600 active:text-yellow-700"
              >
                View Summary
              </a>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ViewProjects;
