import fs from 'node:fs'
import pluralize from 'pluralize'
import { args, BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import path from 'node:path'
import { inject } from '@adonisjs/core'
import CompleteModelService from '#services/complete_model_service'

@inject()
export default class CreateCompleteModel extends BaseCommand {
  private completeModelService: CompleteModelService = new CompleteModelService()
  static commandName = 'make:complete-model'
  static description =
    'This command is used to generate anything that model is needed based on its migration'

  static options: CommandOptions = {}

  @args.string({
    description: 'Name of model',
  })
  declare modelName: string

  async run() {
    const modelName = this.modelName
    const tableName = pluralize(modelName.toLowerCase())
    const pascalCaseModelName = this.completeModelService.toPascalCase(modelName)

    const migrationPath = this.completeModelService.findMigrationPath(tableName)
    if (!migrationPath) {
      this.logger.error(
        `Migration file for ${tableName} not found. Create one using 'node ace make:migration ${modelName}'`
      )
      return
    }

    const modelPath = path.join(import.meta.dirname, `../app/Models/${modelName}.ts`)
    const columns = this.completeModelService.parseMigrationColumn(migrationPath)
    const modelContent = this.completeModelService.generateModelContent(modelName, columns)
    fs.writeFileSync(modelPath, modelContent)
    this.logger.success(`Model ${pascalCaseModelName} created`)

    const servicePath = path.join(import.meta.dirname, `../app/services/${modelName}_service.ts`)
    const serviceContent = this.completeModelService.generateServiceContent(modelName)
    fs.writeFileSync(servicePath, serviceContent)
    this.logger.success(`Service ${pascalCaseModelName}Service created`)
  }
}
