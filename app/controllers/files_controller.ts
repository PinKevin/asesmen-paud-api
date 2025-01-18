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
      return this.responseService.errorResponse(response, `Unggah foto gagal. ${error}`)
    }
  }
}
