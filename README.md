# Kanban Board

A task management application with drag-and-drop functionality, built with React and TypeScript.

## Installation

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Features

### Task Management
- Create, edit, and delete tasks
- Mark tasks as complete/incomplete
- Tasks automatically move to "Done" column when marked complete
- Tasks automatically move to "To Do" column when unmarked
- Drag and drop tasks between columns
- Multi-select tasks (Ctrl/Cmd + Click) and move them together

### Column Management
- Three default columns: To Do, In Progress, Done
- Add custom columns
- Edit column names (double-click)
- Delete custom columns (base columns protected)
- Drag and drop to reorder columns

### Bulk Operations
- Select multiple tasks
- Mark all selected as complete/incomplete (auto-moves to Done/To Do)
- Move all selected to specific column
- Delete multiple tasks at once

### Search and Filters
- Search tasks by title
- Filter by: All, Completed, Incomplete
- Search highlights matching text

### Data Persistence
- All changes saved automatically to localStorage
- Data persists after page refresh

## Project Structure

```
src/
├── components/
│   ├── ui/                    # Reusable UI components
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Checkbox/
│   │   ├── Select/
│   │   ├── Modal/
│   │   └── ...
│   ├── TaskCard/              # Individual task component
│   ├── KanbanColumn/          # Column with tasks
│   ├── SearchBar/             # Search input
│   ├── FilterButtons/         # Filter controls
│   ├── BulkActionsBar/        # Bulk operations toolbar
│   └── AddColumnButton/       # Add new column
├── hooks/
│   ├── useTasks.ts            # Task state and operations
│   ├── useColumns.ts          # Column state and operations
│   ├── useSelection.ts        # Multi-select logic
│   └── useBoardPersistence.ts # localStorage sync
├── utils/
│   ├── storage.ts             # localStorage helpers
│   └── search.ts              # Search and highlight logic
├── types/
│   └── board.types.ts         # TypeScript interfaces
└── App.tsx                    # Main component
```

## Architecture

### State Management
The app uses custom React hooks instead of Redux:

- `useTasks` - manages tasks array and CRUD operations
- `useColumns` - manages columns array and CRUD operations
- `useSelection` - tracks selected tasks (Set<string>)
- `useBoardPersistence` - syncs state to localStorage

### Styling
SCSS Modules for component-scoped styles:
- Each component has its own `.module.scss` file
- Styles are scoped automatically (no class name conflicts)
- BEM-like naming inside modules

### Drag and Drop
Uses `@atlaskit/pragmatic-drag-and-drop`:
- Tasks are draggable
- Columns are drop zones
- When dragging a selected task, all selected tasks move together

### Data Flow
```
User Action
  → Event Handler
    → Hook Method (useTasks/useColumns)
      → State Update
        → Auto-save to localStorage
          → Re-render
```

## Key Logic

### Auto-movement on Status Change
```typescript
// When task is marked complete
checkbox onChange → handleToggleComplete()
  → if completed: move to "Done" column
  → if not completed: move to "To Do" column

// When bulk marking tasks
Mark Complete button → handleMarkSelected(true)
  → all selected tasks → "Done" column + completed = true

Mark Incomplete button → handleMarkSelected(false)
  → all selected tasks → "To Do" column + completed = false
```

### Multi-select Drag
```typescript
// When dragging
if (dragged task is selected) {
  move all selected tasks together
} else {
  move only dragged task
}
// Selection clears after drop
```

### Base Column Protection
```typescript
BASE_COLUMN_IDS = ['todo', 'in-progress', 'done']

// Cannot delete base columns
// Delete button hidden for base columns
// Alert shown if trying to delete
```

## Tech Stack

- **React 18** - UI library
- **TypeScript** - type safety
- **Vite** - build tool
- **SCSS Modules** - scoped styling
- **@atlaskit/pragmatic-drag-and-drop** - drag and drop
- **react-modal** - modal dialogs

## Browser Storage

Data stored in localStorage with key: `kanban-board-data`

Structure:
```json
{
  "columns": [
    { "id": "todo", "title": "To Do", "order": 0, "color": "#3b82f6" }
  ],
  "tasks": [
    { 
      "id": "task-123", 
      "title": "Task name",
      "completed": false,
      "columnId": "todo",
      "order": 0,
      "createdAt": 1700000000000
    }
  ]
}
```

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```
