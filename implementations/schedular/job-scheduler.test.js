const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

/**
 * Test Suite for Job Scheduler
 * Uses the original job-schedular.js code without modification.
 */

// Load the original code
const codePath = path.join(__dirname, "job-schedular.js");
const originalCode = fs.readFileSync(codePath, "utf8");

// Use a context to extract the JobSchedular class
// We append the class name at the end so it's returned as the result of the script
const script = new vm.Script(originalCode + "\nJobSchedular;");
const JobScheduler = script.runInThisContext();

test("Job Scheduler - Example Scenario from README", (t) => {
  const scheduler = new JobScheduler();

  // 1. Add jobs
  scheduler.addJob(1, 5, 100);
  scheduler.addJob(2, 8, 101);
  scheduler.addJob(3, 8, 99);

  // 2. getTopJob() - returns 3 (highest priority, earliest timestamp)
  assert.strictEqual(
    scheduler.getTopJob(),
    3,
    "Top job should be 3 (priority 8, timestamp 99)",
  );

  // 3. startJob() - starts job 3
  if (typeof scheduler.startJob === "function") {
    scheduler.startJob();
  } else {
    assert.fail("startJob method is missing");
  }

  // 4. getTopJob() - returns 2
  assert.strictEqual(
    scheduler.getTopJob(),
    2,
    "Top job should be 2 after starting 3",
  );

  // 5. startJob() - no effect, job 3 running
  scheduler.startJob();

  // 6. completeJob() - removes job 3
  if (typeof scheduler.completeJob === "function") {
    scheduler.completeJob();
  } else {
    assert.fail("completeJob method is missing");
  }

  // 7. getTopJob() - returns 2
  assert.strictEqual(
    scheduler.getTopJob(),
    2,
    "Top job should be 2 after completing 3",
  );

  // 8. startJob() - starts job 2
  scheduler.startJob();

  // 9. removeJob(2) - removes running job 2
  if (typeof scheduler.removeJob === "function") {
    scheduler.removeJob(2);
  } else {
    // This is expected to fail based on my analysis that removeJob is missing
    assert.fail("removeJob method is missing");
  }

  // 10. getTopJob() - returns 1
  assert.strictEqual(
    scheduler.getTopJob(),
    1,
    "Top job should be 1 after removing 2",
  );

  // 11. startJob() - starts job 1
  scheduler.startJob();
});

test("Job Scheduler - Boundary Cases", async (t) => {
  await t.test("Empty scheduler returns null for top job", () => {
    const scheduler = new JobScheduler();
    assert.strictEqual(scheduler.getTopJob(), null);
  });

  await t.test("Single job lifecycle", () => {
    const scheduler = new JobScheduler();
    scheduler.addJob(10, 1, 1000);
    assert.strictEqual(scheduler.getTopJob(), 10);

    scheduler.startJob();
    scheduler.completeJob();

    assert.strictEqual(scheduler.getTopJob(), null);
  });

  await t.test("Priority Ties: Earliest timestamp wins", () => {
    const scheduler = new JobScheduler();
    scheduler.addJob(1, 10, 100);
    scheduler.addJob(2, 10, 50); // Higher priority tie, but earlier timestamp
    scheduler.addJob(3, 10, 150);

    assert.strictEqual(
      scheduler.getTopJob(),
      2,
      "Job 2 should be top due to earlier timestamp (50)",
    );
  });

  await t.test("Running Job Constraint: Only one job can run", () => {
    const scheduler = new JobScheduler();
    scheduler.addJob(1, 10, 100);
    scheduler.addJob(2, 5, 200);

    scheduler.startJob(); // Starts 1
    assert.strictEqual(
      scheduler.getTopJob(),
      2,
      "Top job should be 2 while 1 is running",
    );

    scheduler.startJob(); // Should NOT start 2 because 1 is still running
    assert.strictEqual(
      scheduler.getTopJob(),
      2,
      "Top job remains 2; 1 is still blocking",
    );
  });

  await t.test("Removal of Running Job", () => {
    const scheduler = new JobScheduler();
    scheduler.addJob(1, 10, 100);
    scheduler.addJob(2, 5, 200);

    scheduler.startJob(); // 1 is running
    scheduler.removeJob(1); // Remove 1 while running

    assert.strictEqual(scheduler.getTopJob(), 2, "Job 2 is now top");
    scheduler.startJob(); // Should now be able to start 2

    // No job id 1 should be present, getTopJob should be null if we remove 2
    scheduler.removeJob(2);
    assert.strictEqual(scheduler.getTopJob(), null);
  });

  await t.test("Complex state transitions", () => {
    const scheduler = new JobScheduler();

    // Add A, B
    scheduler.addJob(1, 10, 100);
    scheduler.addJob(2, 20, 200);

    assert.strictEqual(scheduler.getTopJob(), 2);
    scheduler.startJob(); // starts 2

    // Add C while 2 is running
    scheduler.addJob(3, 30, 300);
    assert.strictEqual(scheduler.getTopJob(), 3);

    // Complete 2
    scheduler.completeJob();
    assert.strictEqual(scheduler.getTopJob(), 3);

    scheduler.startJob(); // starts 3
    scheduler.completeJob(); // completes 3

    assert.strictEqual(scheduler.getTopJob(), 1);
  });
});
