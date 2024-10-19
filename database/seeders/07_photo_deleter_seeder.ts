import drive from '@adonisjs/drive/services/main'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    const disk = drive.use()
    await disk.deleteAll('/')
    await disk.put('/note.txt', 'Just some note to preserve storage folder')
  }
}
