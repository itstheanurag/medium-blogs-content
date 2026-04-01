// we should have tags for row_schema like id this is primary key
// find primary key from incoming data
// if none is found we create a default primary key id = Date.now()
//

type TableSchema = Record<string, ColumnSchema>;

class Table {
  private name: string;
  private schema: TableSchema;
  private rows: Record<string, Row> = {};
  constructor(
    private table_name: string,
    private table_schema: TableSchema,
  ) {
    this.name = table_name;
    this.schema = table_schema;
  }

  private validateAndNormalize(data: RowData): {
    primary: string;
    result: RowData;
  } {
    const result: RowData = {};

    for (const key in data) {
      if (!this.schema[key]) {
        throw new Error(
          `Column "${key}" does not exist in table "${this.name}"`,
        );
      }
    }

    // ✅ apply schema rules
    for (const key in this.schema) {
      const col = this.schema[key];
      let value = data[key];

      // default
      if (value === undefined) {
        value = col.default?.() ?? null;
      }

      // type validation
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

    // ✅ primary key handling
    const pk = this.getPrimaryKey();

    if (pk) {
      if (!result[pk]) {
        // fallback PK (not ideal but ok for now)
        result[pk] = Date.now();
      }
      const exists = this.rows[pk];

      if (exists) {
        throw new Error(`Duplicate primary key "${result[pk]}"`);
      }
    } else {
      throw new Error(`A primary key is required`);
    }

    return { primary: pk, result };
  }

  private getPrimaryKey(): string | null {
    let is_found = false;
    let primary_key: string | null = null;

    for (const key in this.schema) {
      if (is_found) {
        throw new Error(`Only one Key can be Primary Key`);
      }

      if (this.schema[key].primary) {
        primary_key = key;
        is_found = true;
      }
    }

    return primary_key;
  }

  create(data: RowData) {
    const { primary, result } = this.validateAndNormalize(data);
    const row = new Row(result);
    this.rows[primary] = row;
    return row;
  }

  findById(data: RowData) {
    const { primary, result } = this.validateAndNormalize(data);
    const row = new Row(result);
    this.rows[primary] = row;
    return row;
  }

  findByPk(primary: string) {
    return this.rows[primary] ?? null;
  }

  deleteByPrimary(primary: string) {
    delete this.rows[primary];
  }

  bulkDelete(ids: string[]) {
    
  }
}
