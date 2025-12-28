# Fix: addNewTask Function

## Problem
`addNewTask()` was still using the old version that only adds tasks to the frontend without saving to backend.

## Solution
Updated to the Phase 3 version that:
1. Calls backend API: `POST /api/user/:userId/tasks`
2. Uses returned task object with ID from backend
3. Properly sets `data-day` and `data-task-id` attributes
4. Uses correct day number instead of 'new'
5. Includes error handling and loading state

## Changes Made
- Function is now `async`
- Calls `apiRequestJSON` to create task in backend
- Uses `task.id` from backend response
- Proper error handling with user feedback
- Loading state (disables input during request)

This ensures tasks are properly persisted to the backend!



