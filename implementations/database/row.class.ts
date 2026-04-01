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

  get(column: string) {
    return this.data[column];
  }

  set(column: string, value: ColumnSchema) {
    if (!(column in this.data)) {
      throw new Error(`Column "${column}" does not exist`);
    }

    this.data[column] = value;
  }

  update(partial: Partial<RowData>) {
    for (const key in partial) {
      if (!(key in this.data)) {
        throw new Error(`Column "${key}" does not exist`);
      }

      this.data[key] = partial[key];
    }
  }

  toJSON() {
    return { ...this.data };
  }

  clone() {
    return new Row(this.data);
  }
}
