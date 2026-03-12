const { test, describe, beforeEach } = require("node:test");
const assert = require("node:assert");
const OptimizedJobScheduler = require("./optimized-schedular");

describe("OptimizedJobScheduler", () => {
  let scheduler;

  beforeEach(() => {
    scheduler = new OptimizedJobScheduler();
  });

  describe("addJob", () => {
    test("should add a job successfully", () => {
      const job = scheduler.addJob(1, 5, 100);
      assert.deepStrictEqual(job, {
        id: 1,
        priority: 5,
        timestamp: 100,
        status: "pending",
      });
    });

    test("should throw error for duplicate job id", () => {
      scheduler.addJob(1, 5, 100);
      assert.throws(() => scheduler.addJob(1, 10, 200), { message: "Duplicate Job" });
    });

    test("should throw error for duplicate timestamp", () => {
      scheduler.addJob(1, 5, 100);
      assert.throws(() => scheduler.addJob(2, 10, 100), { message: "Duplicate timestamp" });
    });
  });

  describe("getTopJob", () => {
    test("should return null for empty scheduler", () => {
      assert.strictEqual(scheduler.getTopJob(), null);
    });

    test("should return the only job", () => {
      scheduler.addJob(1, 5, 100);
      assert.strictEqual(scheduler.getTopJob(), 1);
    });

    test("should return highest priority job", () => {
      scheduler.addJob(1, 5, 100);
      scheduler.addJob(2, 10, 200);
      scheduler.addJob(3, 8, 150);
      assert.strictEqual(scheduler.getTopJob(), 2);
    });

    test("should return earliest timestamp when priorities are equal", () => {
      scheduler.addJob(1, 10, 100);
      scheduler.addJob(2, 10, 50);
      scheduler.addJob(3, 10, 150);
      assert.strictEqual(scheduler.getTopJob(), 2);
    });

    test("should not return running jobs", () => {
      scheduler.addJob(1, 10, 100);
      scheduler.addJob(2, 5, 200);
      scheduler.startJob();
      assert.strictEqual(scheduler.getTopJob(), 2);
    });
  });

  describe("startJob", () => {
    test("should start the highest priority pending job", () => {
      scheduler.addJob(1, 5, 100);
      scheduler.addJob(2, 10, 200);
      scheduler.startJob();
      assert.strictEqual(scheduler.getTopJob(), 1); // Job 2 is running
    });

    test("should not start job if already running", () => {
      scheduler.addJob(1, 10, 100);
      scheduler.addJob(2, 5, 200);
      scheduler.startJob();
      const topBefore = scheduler.getTopJob();
      scheduler.startJob();
      assert.strictEqual(scheduler.getTopJob(), topBefore);
    });
  });

  describe("completeJob", () => {
    test("should remove completed job from scheduler", () => {
      scheduler.addJob(1, 5, 100);
      scheduler.startJob();
      scheduler.completeJob();
      assert.strictEqual(scheduler.getTopJob(), null);
    });

    test("should complete job and allow next job to start", () => {
      scheduler.addJob(1, 10, 100);
      scheduler.addJob(2, 5, 200);
      scheduler.startJob();
      scheduler.completeJob();
      assert.strictEqual(scheduler.getTopJob(), 2);
    });
  });

  describe("removeJob", () => {
    test("should remove pending job", () => {
      scheduler.addJob(1, 5, 100);
      scheduler.addJob(2, 10, 200);
      scheduler.removeJob(1);
      assert.strictEqual(scheduler.getTopJob(), 2);
    });

    test("should remove running job and reset running state", () => {
      scheduler.addJob(1, 10, 100);
      scheduler.addJob(2, 5, 200);
      scheduler.startJob();
      scheduler.removeJob(1);
      assert.strictEqual(scheduler.getTopJob(), 2);
      scheduler.startJob();
      assert.strictEqual(scheduler.getTopJob(), null); // 2 is now running
    });
  });

  describe("Example Scenario", () => {
    test("should follow the problem statement scenario", () => {
      scheduler.addJob(1, 5, 100);
      scheduler.addJob(2, 8, 101);
      scheduler.addJob(3, 8, 99);

      assert.strictEqual(scheduler.getTopJob(), 3);
      scheduler.startJob();

      assert.strictEqual(scheduler.getTopJob(), 2);
      scheduler.startJob();

      scheduler.completeJob();

      assert.strictEqual(scheduler.getTopJob(), 2);
      scheduler.startJob();

      scheduler.removeJob(2);

      assert.strictEqual(scheduler.getTopJob(), 1);
      scheduler.startJob();
      assert.strictEqual(scheduler.getTopJob(), null);
    });
  });
});
