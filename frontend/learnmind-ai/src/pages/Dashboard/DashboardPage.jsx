
import React, { useState, useEffect } from "react";
import Spinner from "../../components/common/Spinner";
import progressService from "../../services/progressService";
import toast from "react-hot-toast";
import {
  FileText,
  BookOpen,
  BrainCircuit,
  TrendingUp,
  Clock,
} from "lucide-react";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await progressService.getDashboardData();
        setDashboardData(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const formatDate = (date) => {
    if (!date) return "Recently";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "Recently";
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getGreetingIcon = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "🌅";
    if (hour < 17) return "☀️";
    return "🌙";
  };

  if (loading) return <Spinner />;

  if (!dashboardData?.overview) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <TrendingUp className="mx-auto mb-4 text-slate-300 dark:text-slate-600" size={52} />
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
            No dashboard data
          </h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Upload your first document to get started.
          </p>
        </div>
      </div>
    );
  }

  const stats = [
    { title: "TOTAL DOCUMENTS", value: dashboardData.overview.totalDocuments || 0, icon: FileText, color: "from-blue-500 to-cyan-500" },
    { title: "TOTAL FLASHCARDS", value: dashboardData.overview.totalFlashcards || 0, icon: BookOpen, color: "from-pink-500 to-purple-500" },
    { title: "TOTAL QUIZZES", value: dashboardData.overview.totalQuizzes || 0, icon: BrainCircuit, color: "from-emerald-500 to-green-500" },
  ];

  return (
    <div className="relative min-h-full">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle,#e5e7eb_1px,transparent_1px)] bg-[length:22px_22px] opacity-60 dark:bg-[radial-gradient(circle,#334155_1px,transparent_1px)]" />
      <div className="mx-auto max-w-7xl px-8 py-8">
        <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 shadow-xl">
          <div className="flex items-center justify-between px-8 py-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-100">LearnMind AI</p>
              <h1 className="mt-3 text-4xl font-bold text-white">
                {getGreeting()} <span className="text-yellow-200">{dashboardData?.user?.username || "Learner"}</span> {getGreetingIcon()}
              </h1>
              <p className="mt-3 text-lg text-emerald-100">
                Ready to continue your AI-powered learning journey today?
              </p>
            </div>
            <div className="hidden h-20 w-20 items-center justify-center rounded-full border border-white/30 bg-white/20 text-3xl font-bold text-white shadow-lg md:flex">
              {(dashboardData?.user?.username || "L").charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {stats.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between p-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">{item.title}</p>
                    <h2 className="mt-3 text-4xl font-bold text-slate-900 dark:text-white">{item.value}</h2>
                  </div>
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color}`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div className={`h-1 bg-gradient-to-r ${item.color}`} />
              </div>
            );
          })}
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-4 border-b border-slate-200 px-6 py-5 dark:border-slate-800">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
              <Clock className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Recent Activity</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Your latest learning activities</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {dashboardData?.recentActivity?.length ? dashboardData.recentActivity.map((activity) => (
              <div key={activity._id} className="flex items-center px-6 py-5 transition hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${activity.type==="document"?"bg-blue-100 dark:bg-blue-900/30":"bg-emerald-100 dark:bg-emerald-900/30"}`}>
                    {activity.type==="document"
                      ? <FileText className="h-6 w-6 text-blue-600 dark:text-blue-300"/>
                      : <BrainCircuit className="h-6 w-6 text-emerald-600 dark:text-emerald-300"/>}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">{activity.title}</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{formatDate(activity.createdAt)}</p>
                  </div>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                  <FileText className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">No Activity Yet</h3>
                <p className="mt-2 max-w-md text-center text-slate-500 dark:text-slate-400">
                  Upload your first document to start generating summaries, flashcards, and quizzes.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
