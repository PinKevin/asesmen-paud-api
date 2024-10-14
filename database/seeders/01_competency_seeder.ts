import Competency from '#models/competency'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Competency.createMany([
      {
        competencyName: 'Nilai Agama dan Budi Pekerti',
        element:
          'Anak mengenal konsep Tuhan Yang Maha Esa, mengenal kebiasaan,praktik ibadah agama atau kepercayaannya, menghargai diri, sesame manusia, dan alam sebagai bentuk syukur terhadap Tuhan Yang Maha Esa',
      },
      {
        competencyName: 'Jati Diri',
        element:
          'Anak mengenali identitas diri, mampu menggunakan fungsi gerak, memiliki kematangan emosi dan sosial untuk berkegiatan di lingkungan belajar',
      },
      {
        competencyName: 'Dasar-dasar Literasi Matematika, Sains, Teknologi, Rekayasa, dan Seni',
        element:
          'Anak memiliki kemampuan literasi dasar, matematika dasar, dan sains, mampu memanfaatkan teknologi dan rekayasa sederhana, serta menciptakan dan mengapresiasi karya seni',
      },
    ])
  }
}
