import RecentProjects from '@/Components/Dashboard/RecentProjects';
import RecentTasks from '@/Components/Dashboard/RecentTasks';
import StatCard from '@/Components/Dashboard/StatCard';
import TasksByStatus from '@/Components/Dashboard/TasksByStatus';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { AlertCircle, CheckCircle2, FolderKanban, ListTodo } from 'lucide-react';

/**
 * Dashboard Page
 *
 * Main dashboard displaying statistics and recent activity.
 * Receives data from DashboardController via Inertia props.
 */
export default function Dashboard({ stats, recent_projects, recent_tasks, overdue_tasks }) {
  return (
    <AuthenticatedLayout
      header={<h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">Dashboard</h2>}
    >
      <Head title="Dashboard" />

      <div className="py-8">
        <div className="mx-auto max-w-7xl space-y-8 sm:px-6 lg:px-8">
          {/* Statistics Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Projects"
              value={stats.projects.total}
              description={`${stats.projects.active} active`}
              icon={<FolderKanban className="h-5 w-5 text-white" />}
              iconColor="bg-blue-500"
            />
            <StatCard
              title="Total Tasks"
              value={stats.tasks.total}
              description={`${stats.tasks.in_progress} in progress`}
              icon={<ListTodo className="h-5 w-5 text-white" />}
              iconColor="bg-purple-500"
            />
            <StatCard
              title="Completed Tasks"
              value={stats.tasks.completed}
              description={`${Math.round((stats.tasks.completed / (stats.tasks.total || 1)) * 100)}% completion rate`}
              icon={<CheckCircle2 className="h-5 w-5 text-white" />}
              iconColor="bg-green-500"
            />
            <StatCard
              title="Overdue Tasks"
              value={overdue_tasks}
              description={stats.tasks.overdue > 0 ? 'Needs attention' : 'All caught up!'}
              icon={<AlertCircle className="h-5 w-5 text-white" />}
              iconColor={stats.tasks.overdue > 0 ? 'bg-red-500' : 'bg-gray-400'}
            />
          </div>

          {/* Recent Activity Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Recent Projects */}
            <RecentProjects projects={recent_projects} />

            {/* Tasks by Status */}
            <TasksByStatus stats={stats.tasks} />
          </div>

          {/* Recent Tasks */}
          <RecentTasks tasks={recent_tasks} />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
