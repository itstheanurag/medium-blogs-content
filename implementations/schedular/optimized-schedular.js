class OptimizedJobScheduler {
  #jobs_map = new Map(); // id -> job
  #is_running = false;
  #running_job_id = null;
  #unique_time_stamp = new Set();
  constructor() {}

  // `id` (unique integer), `priority` (integer), `timestamp` (unique integer)
  // - Stores the job in the scheduler.
  addJob(id, priority, timestamp) {
    if (this.#jobs_map.has(id)) throw Error("Duplicate Job");
    if (this.#unique_time_stamp.has(timestamp))
      throw Error("Duplicate timestamp");
    const job = { id, priority, timestamp, status: "pending" };

    this.#jobs_map.set(id, job);
    this.#unique_time_stamp.add(timestamp);

    return job;
  }

  getTopJob() {
    return this.#computeTopJob();
  }

  // - Marks the highest priority pending job as running.
  // - Only one job can be running at a time; ignore or return error if already running.
  startJob() {
    if (this.#is_running) return;
    const jobId = this.#computeTopJob();
    if (jobId === null) return;

    const job = this.#jobs_map.get(jobId);

    this.#jobs_map.set(jobId, {
      ...job,
      status: "running",
    });

    this.#is_running = true;
    this.#running_job_id = jobId;
    return;
  }

  // - **Complete Job**
  // - Completes and removes the currently running job from the scheduler.
  // - If no running job exists, ignore or return error.
  completeJob() {
    if (!this.#is_running || this.#running_job_id === null) return;
    const jobId = this.#running_job_id;
    const job = this.#jobs_map.get(jobId);

    this.#is_running = false;
    this.#running_job_id = null;
    this.#jobs_map.delete(jobId);
    this.#unique_time_stamp.delete(job.timestamp);
    return;
  }

  //   - **Input:** `id`
  // - Removes the job if present (pending or running).
  removeJob(id) {
    const job = this.#jobs_map.get(id);

    if (!job) {
      throw Error("Job not found");
    }

    if (job.status == "running") {
      this.#is_running = false;
      this.#running_job_id = null;
    }

    this.#unique_time_stamp.delete(job.timestamp);
    this.#jobs_map.delete(id);
  }

  // compute the highest priority job

  #computeTopJob() {
    const allJobs = Array.from(this.#jobs_map.values());
    const job = allJobs
      .filter((job) => job.status == "pending")
      .reduce((best, job) => {
        if (!best) return job;
        if (job.priority > best.priority) return job;
        if (job.priority === best.priority && job.timestamp < best.timestamp)
          return job;
        return best;
      }, null);

    return job ? job.id : null;
  }
}

module.exports = OptimizedJobScheduler;
