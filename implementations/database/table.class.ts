class Table {
  private rows: Record<string, Row> = {};
  private validator: TableValidator;

  constructor(
    private name: string,
    private schema: TableSchema,
  ) {
    this.validator = new TableValidator(schema, name);
  }

  create(data: RowData) {
    const normalized = this.validator.validateAndNormalize(data);

    const pkName = this.validator.getPrimaryKey()!;
    const pkValue = normalized[pkName] as string;

    if (this.rows[pkValue]) {
      throw new Error(`Duplicate primary key "${pkValue}"`);
    }

    const row = new Row(normalized);
    this.rows[pkValue] = row;

    return row;
  }

  update(pkValue: string, data: Partial<RowData>) {
    const existing = this.rows[pkValue];
    if (!existing) {
      throw new Error(`Row not found`);
    }

    const pkName = this.validator.getPrimaryKey()!;

    delete data[pkName];
    
    const updated = {
      ...existing.toJSON(),
      ...data,
    };

    const normalized = this.validator.validateAndNormalize(updated);

    existing.update(normalized);
    return existing;
  }

  findByPk(pkValue: string) {
    return this.rows[pkValue] ?? null;
  }

  deleteByPk(pkValue: string) {
    delete this.rows[pkValue];
  }

  bulkDelete(pkValues: string[]) {
    for (const pk of pkValues) {
      delete this.rows[pk];
    }
  }

  all() {
    return Object.values(this.rows).map((row) => row.toJSON());
  }
}
