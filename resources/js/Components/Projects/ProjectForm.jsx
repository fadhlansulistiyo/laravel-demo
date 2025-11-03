import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { format, parse } from 'date-fns';
import { AlertCircle } from 'lucide-react';

/**
 * ProjectForm Component
 *
 * Form for creating or editing a project.
 *
 * @param {Object} project - Existing project object for editing (optional)
 * @param {Array} statuses - Available project statuses
 */
export default function ProjectForm({ project = null, statuses = [] }) {
  const isEditing = !!project;

  // Helper function to parse date string to Date object
  const parseDate = (dateString) => {
    if (!dateString) return undefined;
    try {
      return parse(dateString, 'yyyy-MM-dd', new Date());
    } catch {
      return undefined;
    }
  };

  const { data, setData, post, put, processing, errors, reset } = useForm({
    name: project?.name || '',
    description: project?.description || '',
    status: project?.status?.value || 'active',
    start_date: project?.start_date || '',
    end_date: project?.end_date || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      put(route('projects.update', project.id), {
        preserveScroll: true,
        onSuccess: () => {
          // Success notification will be handled by the page
        },
      });
    } else {
      post(route('projects.store'), {
        preserveScroll: true,
        onSuccess: () => {
          reset();
        },
      });
    }
  };

  // Default statuses if not provided
  const defaultStatuses = [
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'archived', label: 'Archived' },
  ];

  const statusOptions = statuses.length > 0 ? statuses : defaultStatuses;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Project' : 'Create New Project'}</CardTitle>
        <CardDescription>
          {isEditing ? 'Update your project details below.' : 'Fill in the details to create a new project.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Project Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              placeholder="Enter project name"
              className={errors.name ? 'border-destructive' : ''}
              required
            />
            {errors.name && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.name}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={data.description}
              onChange={(e) => setData('description', e.target.value)}
              placeholder="Enter project description (optional)"
              rows={4}
              className={errors.description ? 'border-destructive' : ''}
            />
            {errors.description && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.description}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">
              Status <span className="text-destructive">*</span>
            </Label>
            <Select value={data.status} onValueChange={(value) => setData('status', value)}>
              <SelectTrigger className={errors.status ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.status}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <DatePicker
                date={data.start_date ? parseDate(data.start_date) : undefined}
                onSelect={(date) => setData('start_date', date ? format(date, 'yyyy-MM-dd') : '')}
                placeholder="Select start date"
                className={errors.start_date ? 'border-destructive' : ''}
              />
              {errors.start_date && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.start_date}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <DatePicker
                date={data.end_date ? parseDate(data.end_date) : undefined}
                onSelect={(date) => setData('end_date', date ? format(date, 'yyyy-MM-dd') : '')}
                placeholder="Select end date"
                className={errors.end_date ? 'border-destructive' : ''}
              />
              {errors.end_date && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.end_date}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-4 pt-4">
            <Button type="submit" disabled={processing}>
              {processing ? 'Saving...' : isEditing ? 'Update Project' : 'Create Project'}
            </Button>
            <Button type="button" variant="outline" onClick={() => window.history.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
