import ResponseService from '#services/response_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { normalize, sep } from 'node:path'

@inject()
export default class PhotoController {
  PATH_TRAVERSAL_REGEX = /(?:^|[\\/])\.\.(?:[\\/]|$)/

  constructor(private responseService: ResponseService) {}

  getFileFromStorage({ request, response }: HttpContext) {
    const filePath = request.param('*').join(sep)
    const normalizedPath = normalize(filePath)

    if (this.PATH_TRAVERSAL_REGEX.test(normalizedPath)) {
      return this.responseService.failResponse(response, 'Malformed path')
    }

    const absolutePath = app.makePath('storage', normalizedPath)
    return response.download(absolutePath)
  }
}
