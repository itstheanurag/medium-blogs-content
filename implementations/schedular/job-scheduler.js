// job status - pending, completed and running

class JobScheduler {
  #jobs = [];
  #isRunning = false;
  #runningJobIndex = -1;

  constructor() {}

  // `id` (unique integer), `priority` (integer), `timestamp` (unique integer)
  // - Stores the job in the scheduler.
  addJob(id, priority, timestamp) {
    const job = { id, priority, timestamp, status: "pending" };
    this.#jobs.push(job);
    return job;
  }

  getTopJob() {
    const highest_priority_job_element = this.#getHighestPriorityJob();

    if (!highest_priority_job_element) {
      // no highest priority job found
      return null;
    }

    const job = this.#findJobByPriorityWithLeastTimestamp(
      highest_priority_job_element.priority,
    );

    if (!job) {
      return null;
    }

    return job.id;
  }

  // - Marks the highest priority pending job as running.
  // - Only one job can be running at a time; ignore or return error if already running.
  startJob() {
    if (this.#isRunning) return;

    const highestPriority = this.#getHighestPriorityJob();

    const job = this.#findJobByPriorityWithLeastTimestamp(
      highestPriority.priority,
    );

    const index = this.#findIndexFromId(job.id);
    this.#jobs[index].status = "running";

    this.#isRunning = true;
    this.#runningJobIndex = index;
  }

  // - **Complete Job**
  // - Completes and removes the currently running job from the scheduler.
  // - If no running job exists, ignore or return error.
  completeJob() {
    if (!this.#isRunning) return;

    this.#jobs[this.#runningJobIndex].status = "completed";
    console.log("COMPLETED JOB: ", this.#jobs[this.#runningJobIndex]);
    console.log("Removing Job");

    this.#jobs.splice(this.#runningJobIndex, 1);
    console.log("Done");
    this.#isRunning = false;
    this.#runningJobIndex = -1;
    return this.#jobs;
  }

  //   - **Input:** `id`
  // - Removes the job if present (pending or running).
  removeJob(id) {
    const index = this.#findIndexFromId(id);
    const job = this.#jobs[index];

    if (job) {
      if (job.status == "running") {
        this.#isRunning = false;
        this.#runningJobIndex = -1;
      }

      this.#jobs.splice(index, 1);
    }

    return this.#jobs.map((job) => job.id);
  }

  // find the job index in the array based on id
  #findIndexFromId(id) {
    let ans = -1;

    for (let i = 0; i < this.#jobs.length; i++) {
      const job = this.#jobs[i];
      if (job.id === id) return i;
    }

    return ans;
  }

  // get the highest priority
  #getHighestPriorityJob() {
    const pendingJobs = this.#jobs.filter((job) => job.status == "pending");
    pendingJobs.sort((a, b) => b.priority - a.priority); // asc
    return pendingJobs.length ? pendingJobs[0] : null;
  }

  // find lowest timestamp job based on Priority
  #findJobByPriorityWithLeastTimestamp(priority) {
    const allJobs = this.#jobs.filter(
      (element) => element.priority == priority && element.status == "pending",
    );

    allJobs.sort((a, b) => a.timestamp - b.timestamp); // desc
    return allJobs.length ? allJobs[0] : null;
  }
}
