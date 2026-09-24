class LFUCache {
  constructor(capacity) {
    this.keyToVal = new Map();
    this.keyfreq = new Map();

    this.capacity = capacity;
    this.minFreq = 0;
    this.size = 0;
  }

  get(key) {
    console.log(`\nGET(${key})`);

    if (!this.keyToVal.has(key)) {
      console.log("Key not found");
      return -1;
    }

    const entry = this.keyToVal.get(key);

    console.log(`Found ${key}: value=${entry.value}, freq=${entry.freq}`);

    this._increaseFreq(key, entry);

    this._logState();

    return entry.value;
  }

  put(key, value) {
    console.log(`\nPUT(${key}, ${value})`);

    if (!this.capacity) {
      console.log("Cache capacity is 0");
      return;
    }

    // Existing key
    if (this.keyToVal.has(key)) {
      const entry = this.keyToVal.get(key);

      console.log(`Updating existing key: ${key}, ${entry.value} -> ${value}`);

      entry.value = value;

      this._increaseFreq(key, entry);

      this._logState();

      return;
    }

    // Cache is full
    if (this.size >= this.capacity) {
      const minFreqKeys = this.keyfreq.get(this.minFreq);

      // First key = LRU among this frequency
      const lruKey = minFreqKeys.keys().next().value;

      console.log(`Evicting: ${lruKey}, freq=${this.minFreq}`);

      minFreqKeys.delete(lruKey);
      this.keyToVal.delete(lruKey);

      this.size--;

      if (minFreqKeys.size === 0) {
        this.keyfreq.delete(this.minFreq);
      }
    }

    // New keys start with frequency 1
    const entry = {
      value: value,
      freq: 1,
    };

    this.keyToVal.set(key, entry);

    if (!this.keyfreq.has(1)) {
      this.keyfreq.set(1, new Map());
    }

    this.keyfreq.get(1).set(key, true);

    this.minFreq = 1;
    this.size++;

    this._logState();
  }

  _increaseFreq(key, entry) {
    const oldFreq = entry.freq;

    console.log(`Increasing frequency: ${key}, ${oldFreq} -> ${oldFreq + 1}`);

    // Remove key from old frequency bucket
    const oldFreqKeys = this.keyfreq.get(oldFreq);

    oldFreqKeys.delete(key);

    // If bucket becomes empty
    if (oldFreqKeys.size === 0) {
      this.keyfreq.delete(oldFreq);
      if (this.minFreq === oldFreq) {
        this.minFreq++;
      }
    }

    // Increase frequency
    entry.freq++;
    const newFreq = entry.freq;
    // Create new bucket
    if (!this.keyfreq.has(newFreq)) {
      this.keyfreq.set(newFreq, new Map());
    }

    // Add to the END of the new bucket.
    // END = most recently used.
    this.keyfreq.get(newFreq).set(key, true);
  }

  _logState() {
    console.log("keyToVal buckets:", this.keyToVal);
    console.log("Frequency buckets:", this.keyfreq);
    console.log(`Minimum frequency: ${this.minFreq}`);
    console.log(`Size: ${this.size}`);
  }
}

function solve(capacity) {
  return new LFUCache(capacity);
}

const cache = solve(3);

cache.put("A", 1);
cache.put("B", 2);
cache.put("C", 3);

cache.get("A");
cache.get("B");
cache.get("C");

cache.put("D", 4);
