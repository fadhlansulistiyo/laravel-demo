import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/**
 * StatCard Component
 *
 * Displays a single statistic with an icon, title, value, and optional description.
 *
 * @param {string} title - The title of the stat (e.g., "Total Projects")
 * @param {string|number} value - The main value to display
 * @param {string} description - Optional description or change indicator
 * @param {React.ReactNode} icon - Icon component to display
 * @param {string} iconColor - Tailwind color class for icon background
 */
export default function StatCard({ title, value, description, icon, iconColor = 'bg-primary' }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className={cn('rounded-full p-2', iconColor)}>{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
}
