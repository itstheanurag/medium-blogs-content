type TableSchema = Record<string, ColumnSchema>;

class TableValidator {
  constructor(
    private schema: TableSchema,
    private tableName: string,
  ) {}

  validateAndNormalize(data: RowData): RowData {
    this.validateUnknownKeys(data);
    const result = this.normalizeData(data);

    const pkName = this.getPrimaryKey();
    
    if (!pkName) {
      throw new Error(`A primary key is required`);
    }

    this.ensurePrimaryKey(result, pkName);

    return result;
  }

  private validateUnknownKeys(data: RowData) {
    for (const key in data) {
      if (!this.schema[key]) {
        throw new Error(
          `Column "${key}" does not exist in table "${this.tableName}"`,
        );
      }
    }
  }

  private normalizeData(data: RowData): RowData {
    const result: RowData = {};

    for (const key in this.schema) {
      const col = this.schema[key];
      let value = data[key];

      if (value === undefined) {
        value = col.default?.() ?? null;
      }

      if (value !== null && col.type) {
        if (col.type === "string" && typeof value !== "string") {
          throw new Error(`${key} must be string`);
        }
        if (col.type === "number" && typeof value !== "number") {
          throw new Error(`${key} must be number`);
        }
        if (col.type === "boolean" && typeof value !== "boolean") {
          throw new Error(`${key} must be boolean`);
        }
        if (col.type === "array" && !Array.isArray(value)) {
          throw new Error(`${key} must be an array`);
        }
        if (col.type === "object" && typeof value !== "object") {
          throw new Error(`${key} must be an object`);
        }
      }

      result[key] = value;
    }

    return result;
  }

  getPrimaryKey(): string | null {
    let found: string | null = null;

    for (const key in this.schema) {
      if (this.schema[key].primary) {
        if (found) {
          throw new Error(`Only one primary key allowed`);
        }
        found = key;
      }
    }

    return found;
  }

  private ensurePrimaryKey(result: RowData, pkName: string) {
    if (!result[pkName]) {
      result[pkName] = Date.now().toString();
    }
  }
}
