type ColumnSchema = {
  primary?: boolean;
  default?: () => unknown;
  type?: "string" | "number" | "boolean" | "array" | "object"; // keep simple for now
};

type RowData = Record<string, unknown>;

class Row {
  private data: RowData;

  constructor(data: RowData) {
    // clone to avoid external mutation
    this.data = { ...data };
  }

  update(partial: Partial<RowData>) {
    for (const key in partial) {
      if (!(key in this.data)) {
        throw new Error(`Column "${key}" does not exist`);
      }

      this.data[key] = partial[key];
    }

    return this.data;
  }

  toJSON() {
    return { ...this.data };
  }
}
