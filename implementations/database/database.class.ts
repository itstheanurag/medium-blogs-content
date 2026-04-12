class InMemoryDatabase {
  database_name: string = "";
  private tables: Record<string, Table> = {};
  constructor(name: string) {
    this.database_name = name;
  }

  create_table(name: string, schema: TableSchema) {
    if (this.tables[name])
      throw new Error(`Table named: ${name} already exists`);

    const table = new Table(name, schema);
    this.tables[name] = table;
  }

  alter_table(name: string, schema: TableSchema) {
    if (this.tables[name])
      throw new Error(`Table named: ${name} already exists`);

    const table = new Table(name, schema);
    this.tables[name] = table;
  }

  delete_table(name: string, schema: TableSchema) {
    if (this.tables[name])
      throw new Error(`Table named: ${name} already exists`);

    const table = new Table(name, schema);
    this.tables[name] = table;
  }
}
