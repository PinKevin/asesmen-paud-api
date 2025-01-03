import { cuid } from '@adonisjs/core/helpers'
import { MultipartFile } from '@adonisjs/core/types/bodyparser'

export default class FileService {
  async saveFileToDisk(file: MultipartFile) {
    const fileName = `${cuid()}.${file.extname}`
    await file.moveToDisk(fileName)

    return fileName
  }
}
