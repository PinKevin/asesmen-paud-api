import fs from 'node:fs'
import path from 'node:path'

export default class CompleteModelService {
  parseMigrationColumn(migrationPath: string): any[] {
    const fileContent = fs.readFileSync(migrationPath, 'utf-8')
    const columnDefinitions: any[] = []

    const columnRegex = /table\.(\w+)\(['"`](\w+)['"`]/g
    let match: RegExpExecArray | null

    while ((match = columnRegex.exec(fileContent)) !== null) {
      const [, columnType, columnName] = match
      columnDefinitions.push({ columnName, columnType })
    }

    return columnDefinitions
  }

  findMigrationPath(tableName: string): string | null {
    const migrationsDir = path.join(import.meta.dirname, '../../database/migrations')
    const files = fs.readdirSync(migrationsDir)

    const migrationRegex = new RegExp(`\\d+_create_${tableName}_table\\.ts$`)

    for (const file of files) {
      if (migrationRegex.test(file)) {
        return path.join(migrationsDir, file)
      }
    }
    return null
  }

  generateModelContent(modelName: string, columns: any[]) {
    const pascalCaseModelName = this.toPascalCase(modelName)
    const columnsCode = columns
      .map(({ columnName, columnType }) => {
        if (columnName === 'created_at') {
          return `  @column.dateTime({ autoCreate: true })\n  declare createdAt: DateTime`
        } else if (columnName === 'updated_at') {
          return `  @column.dateTime({ autoCreate: true, autoUpdate: true })\n  declare updatedAt: DateTime`
        } else {
          return `  @column()\n  declare ${this.toCamelCase(columnName)}: ${this.getTypeScriptType(columnType)}`
        }
      })
      .join('\n\n')

    return `import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class ${pascalCaseModelName} extends BaseModel {
${columnsCode}
}`
  }

  generateServiceContent(modelName: string) {
    const pascalCaseModelName = this.toPascalCase(modelName)

    return `import ${pascalCaseModelName} from '#models/${modelName}'

export default class ${pascalCaseModelName}Service {
  public async index() {
    return ${pascalCaseModelName}.all()
  }

  public async store(data: Partial<${pascalCaseModelName}>) {
    return ${pascalCaseModelName}.create(data)
  }

  public async show(id: number) {
    return ${pascalCaseModelName}.findOrFail(id)
  }

  public async update(id: number, data: Partial<${pascalCaseModelName}>) {
    const record = await ${pascalCaseModelName}.findOrFail(id)
    record.merge(data)
    await record.save()
    return record
  }

  public async destroy(id: number) {
    const record = await ${pascalCaseModelName}.findOrFail(id)
    await record.delete()
  }
}`
  }

  getTypeScriptType(columnType: string): string {
    switch (columnType) {
      case 'increments':
        return 'number'
      case 'bigIncrements':
        return 'number'
      case 'boolean':
        return 'boolean'
      case 'string':
        return 'string'
      case 'integer':
        return 'number'
      case 'bigInteger':
        return 'number'
      case 'date':
        return 'Date'
      case 'decimal':
        return 'number'
      case 'timestamp':
        return 'DateTime'
      default:
        return 'any'
    }
  }

  toPascalCase(name: string): string {
    return name
      .toLowerCase()
      .split('_')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('')
  }

  toCamelCase(name: string): string {
    const parts = name.toLowerCase().split('_')
    return (
      parts[0] +
      parts
        .slice(1)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('')
    )
  }
}
