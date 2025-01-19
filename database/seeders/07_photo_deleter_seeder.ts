// import drive from '@adonisjs/drive/services/main'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
// import { readFile } from 'node:fs/promises'
// import path from 'node:path'

export default class extends BaseSeeder {
  async run() {
    // const disk = drive.use()
    // await disk.deleteAll('/')
    // await disk.put('/note.txt', 'Just some note to preserve storage folder')
    // const sourcePath = path.resolve('tmp', 'pp-profile-test.jpeg')
    // const destinationPath = 'pp-profile-test.jpeg'
    // try {
    //   // Read file content from tmp directory
    //   const fileBuffer = await readFile(sourcePath)
    //   // Upload the file content to the disk
    //   await disk.put(destinationPath, fileBuffer)
    //   console.log('File uploaded successfully')
    // } catch (error) {
    //   console.error('Error uploading file:', error)
    // }
  }
}
