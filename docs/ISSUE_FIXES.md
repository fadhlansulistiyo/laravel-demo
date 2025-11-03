# Issue Fixes - Project Management Features

**Date**: November 3, 2025
**Status**: All Issues Resolved ✅

---

## Overview

This document details the issues encountered in the Projects and Tasks management pages and their resolutions.

---

## Issues Fixed

### 1. Ziggy Route Error on Project Details Page ❌ → ✅

**Issue**:
```
Uncaught Error: Ziggy error: 'project' parameter is required for route 'projects.edit'
```

**Location**: `resources/js/Pages/Projects/Show.jsx:103`

**Root Cause**:
Laravel API Resources automatically wrap data in a `data` property when passed to Inertia.js:
```php
// Without ->resolve()
['project' => new ProjectResource($project)]

// Results in frontend receiving:
{ project: { data: { id: 10, name: "..." } } }
```

This caused `project.id` to be `undefined` (actual path was `project.data.id`), triggering the Ziggy error.

**Solution**:
Added `->resolve()` to unwrap API Resources before passing to Inertia:

```php
// app/Http/Controllers/ProjectController.php
return Inertia::render('Projects/Show', [
    'project' => (new ProjectResource($projectDetails))->resolve(),
]);
```

**Files Modified**:
- `app/Http/Controllers/ProjectController.php` (methods: `index`, `show`, `edit`)
- `app/Http/Controllers/TaskController.php` (methods: `index`, `create`, `show`, `edit`)

---

### 2. Edit Form Not Loading Existing Data ❌ → ✅

**Issue**: Project edit form did not display existing start_date and end_date values.

**Root Cause**: Same as Issue #1 - data was wrapped in `data` property, preventing form access to `project.start_date` directly.

**Solution**: Fixed by unwrapping API Resources in controllers (same fix as Issue #1).

**Verification**: The `ProjectForm` component was already correctly implemented:
```jsx
const { data, setData } = useForm({
    start_date: project?.start_date || '',
    end_date: project?.end_date || '',
});
```

---

### 3. Date Picker Implementation ❌ → ✅

**Issue**: Project forms used basic HTML `<input type="date">` instead of a proper date picker component.

**Solution**: Created a reusable DatePicker component using shadcn/ui.

**New Component**: `resources/js/Components/ui/date-picker.jsx`
```jsx
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';

export function DatePicker({ date, onSelect, placeholder }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          {date ? format(date, 'PPP') : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Calendar mode="single" selected={date} onSelect={onSelect} />
      </PopoverContent>
    </Popover>
  );
}
```

**Implementation**: `resources/js/Components/Projects/ProjectForm.jsx`
```jsx
<DatePicker
  date={data.start_date ? parseDate(data.start_date) : undefined}
  onSelect={(date) => setData('start_date', date ? format(date, 'yyyy-MM-dd') : '')}
  placeholder="Select start date"
/>
```

**Features**:
- Visual calendar picker with better UX
- Date formatted as "January 15, 2025" for display
- Stored as "YYYY-MM-DD" format for backend
- Proper handling of nullable dates

---

### 4. Nested Collection Wrapping Error ❌ → ✅

**Issue**:
```
Uncaught TypeError: tasks.map is not a function
```

**Location**: `resources/js/Components/Tasks/TaskList.jsx:38`

**Root Cause**:
Even after applying `->resolve()` to unwrap the top-level resource, **nested collections** remained wrapped:

```json
{
  "id": 10,
  "name": "Project Name",
  "tasks": {
    "data": [...]  // ❌ Still wrapped
  }
}
```

**Why**: `->resolve()` only unwraps one level. Nested `TaskResource::collection()` inside `ProjectResource::toArray()` is evaluated separately and retains its wrapping.

**Solution**: Handle nested wrapping in the frontend component:

```jsx
// resources/js/Pages/Projects/Show.jsx
export default function Show({ project, stats }) {
  // Handle nested resource collection wrapping
  const tasks = Array.isArray(project.tasks)
    ? project.tasks
    : (project.tasks?.data || []);

  return <TaskList tasks={tasks} />;
}
```

**Why This Approach**:
- ✅ Resilient to backend changes
- ✅ Simple one-liner per nested collection
- ✅ Type-safe with graceful fallback
- ✅ Easy to maintain

---

## Best Practices for Laravel + Inertia.js + API Resources

### Pattern to Follow

**Backend (Controller)**:
```php
return Inertia::render('Page/Show', [
    'resource' => (new ResourceClass($model))->resolve(),  // Unwrap top level
]);
```

**Frontend (React Component)**:
```jsx
export default function Show({ resource }) {
  // Unwrap nested collections as needed
  const items = Array.isArray(resource.items)
    ? resource.items
    : (resource.items?.data || []);

  return <List items={items} />;
}
```

### Key Principles

1. **Always use `->resolve()`** when passing API Resources to Inertia
2. **Handle nested wrapping in frontend** where the data is consumed
3. **Provide fallback arrays** to prevent runtime errors
4. **Test with empty/null data** to ensure robustness

---

## Files Modified Summary

### Backend (PHP)
| File | Changes |
|------|---------|
| `app/Http/Controllers/ProjectController.php` | Added `->resolve()` to 3 methods |
| `app/Http/Controllers/TaskController.php` | Added `->resolve()` to 4 methods |

### Frontend (React)
| File | Changes |
|------|---------|
| `resources/js/Components/ui/date-picker.jsx` | **New**: Reusable DatePicker component |
| `resources/js/Components/Projects/ProjectForm.jsx` | Integrated DatePicker with date-fns |
| `resources/js/Pages/Projects/Show.jsx` | Added nested collection unwrapping |

---

## Testing Checklist

✅ Project Details Page
- Page loads without errors
- Tasks list displays correctly
- Edit/Delete buttons work
- Add Task button works

✅ Project Forms
- Create project with date picker
- Edit project shows existing dates
- Dates save correctly

✅ Task Pages
- All CRUD operations work
- Project selection dropdowns work

✅ Dashboard
- Recent projects display
- Recent tasks display
- Statistics show correctly

---

## Technical Details

### API Resource Wrapping Behavior

**Level 1 - Top-level wrapping**:
```php
new ProjectResource($project)
// Returns: { data: { id: 1, name: "..." } }

(new ProjectResource($project))->resolve()
// Returns: { id: 1, name: "..." } ✅
```

**Level 2 - Nested wrapping**:
```php
class ProjectResource {
    public function toArray() {
        return [
            'id' => $this->id,
            'tasks' => TaskResource::collection($this->tasks),  // Still wrapped!
        ];
    }
}

// After ->resolve() on parent:
// { id: 1, tasks: { data: [...] } } ❌
```

### Date Handling

**Format Flow**:
1. Backend stores: `2025-11-03` (YYYY-MM-DD)
2. Frontend receives: `"2025-11-03"` (string)
3. Parse to Date object: `parse(dateString, 'yyyy-MM-dd', new Date())`
4. Display: `format(date, 'PPP')` → "November 3, 2025"
5. Submit: `format(date, 'yyyy-MM-dd')` → "2025-11-03"

---

## Lessons Learned

1. **Laravel API Resources** require explicit unwrapping when used with Inertia.js
2. **Nested resources** need special handling at the component level
3. **Type checking** (`Array.isArray()`) prevents runtime errors
4. **Date handling** requires proper parsing and formatting libraries (date-fns)
5. **Frontend fixes** are sometimes cleaner than backend workarounds

---

## Related Documentation

- [Laravel API Resources](https://laravel.com/docs/11.x/eloquent-resources)
- [Inertia.js Manual Visits](https://inertiajs.com/manual-visits)
- [date-fns Documentation](https://date-fns.org/)
- [shadcn/ui Date Picker](https://ui.shadcn.com/docs/components/date-picker)

---

**Status**: Production Ready ✅
**Last Updated**: November 3, 2025
