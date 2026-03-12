# Job Scheduler

## Overview

Design and implement a simple Job Scheduler system for managing jobs with priority and timestamp attributes. This scheduler supports operations for adding, removing, and managing the job lifecycle with a running job constraint.

## Functional Requirements

- **Add a Job**
  - **Input:** `id` (unique integer), `priority` (integer), `timestamp` (unique integer)
  - Stores the job in the scheduler.
- **Remove a Job**
  - **Input:** `id`
  - Removes the job if present (pending or running).
- **Get Top Job**
  - **Output:** Returns the `id` of the highest priority pending job.
  - If multiple jobs share the highest priority, return the one with the earliest timestamp.
  - Return `null` if no pending jobs exist.
- **Start a Job**
  - Marks the highest priority pending job as running.
  - Only one job can be running at a time; ignore or return error if already running.
- **Complete Job**
  - Completes and removes the currently running job from the scheduler.
  - If no running job exists, ignore or return error.

## Usage Interface

Implement these methods in a class named `JobScheduler`:

```javascript
class JobScheduler {
  addJob(id, priority, timestamp)
  removeJob(id)
  getTopJob()    // returns id or null
  startJob()     // marks top job running
  completeJob()  // completes & removes running job
}
```

## Example Scenario

```javascript
const scheduler = new JobScheduler();

scheduler.addJob(1, 5, 100);
scheduler.addJob(2, 8, 101);
scheduler.addJob(3, 8, 99);

scheduler.getTopJob(); // returns 3
scheduler.startJob();  // starts job 3

scheduler.getTopJob(); // returns 2
scheduler.startJob();  // no effect, job 3 running

scheduler.completeJob(); // removes job 3

scheduler.getTopJob(); // returns 2
scheduler.startJob();  // starts job 2

scheduler.removeJob(2); // removes running job 2

scheduler.getTopJob(); // returns 1
scheduler.startJob();  // starts job 1
```

