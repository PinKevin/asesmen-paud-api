import FileService from '#services/file_service'
import ResponseService from '#services/response_service'
import { photoValidation } from '#validators/photo_upload'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class FilesController {
  constructor(
    private fileService: FileService,
    private responseService: ResponseService
  ) {}

  async uploadPhoto({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(photoValidation)
      const filePath = await this.fileService.saveFileToDisk(payload.photo)
      return this.responseService.successResponse(
        response,
        'Foto berhasil diunggah',
        { filePath },
        201
      )
    } catch (error) {
      console.log(error)
      return this.responseService.errorResponse(response, `Unggah foto gagal. ${error}`)
    }
  }

  async getPhoto({ request, response }: HttpContext) {
    try {
      const fileName = request.param('fileName')
      const { metadata, stream } = await this.fileService.getFromDisk(fileName)

      if (!stream) {
        return this.responseService.failResponse(response, 'Foto tidak ditemukan', 404)
      }

      response.header('Content-Type', metadata.contentType!)
      return response.stream(stream)
    } catch (error) {
      console.log(error)
      return this.responseService.errorResponse(response, `Ambil foto gagal. ${error}`)
    }
  }
}
