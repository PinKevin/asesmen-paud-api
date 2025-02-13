import { cuid } from '@adonisjs/core/helpers'
import { MultipartFile } from '@adonisjs/core/types/bodyparser'
import drive from '@adonisjs/drive/services/main'

export default class FileService {
  async saveFileToDisk(file: MultipartFile) {
    const fileName = `${cuid()}.${file.extname}`
    await file.moveToDisk(fileName)
    return fileName
  }

  async getFromDisk(key: string) {
    const metadata = await drive.use('gcs').getMetaData(key)
    const stream = await drive.use('gcs').getStream(key)
    return { metadata, stream }
  }
}
