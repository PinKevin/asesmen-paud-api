import SubLearningScope from '#models/sub_learning_scope'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await SubLearningScope.createMany([
      {
        subLearningScopeName:
          'Anak percaya kepada Tuhan Yang Maha Esa, mulai mengenal dan anak percaya kepada Tuhan Yang Maha Esa, mulai mengenal dan mempraktikkan ajaran pokok sesuai dengan agama dan kepercayaannya',
        learningScopeId: 1,
      },
      {
        subLearningScopeName:
          'Anak menghargai sesama manusia dengan berbagai perbedaannya dan mempraktikkan perilaku baik dan berakhlak mulia',
        learningScopeId: 2,
      },
      {
        subLearningScopeName:
          'Anak menghargai alam dengan cara merawatnya dan menunjukkan rasa sayang terhadap makhluk hidup yang merupakan ciptaan Tuhan Yang Maha Esa',
        learningScopeId: 2,
      },
      {
        subLearningScopeName:
          'Anak berpartisipasi aktif dalam menjaga kebersihan, kesehatan, dan keselamatan diri sebagai bentuk rasa sayang terhadap dirinya dan rasa syukur kepada Tuhan Yang Maha Esa',
        learningScopeId: 3,
      },
      {
        subLearningScopeName:
          'Anak memahami identitas dirinya yang terbentuk oleh ragam minat, kebutuhan, karakteristik gender, agama, dan sosial budaya',
        learningScopeId: 4,
      },
      {
        subLearningScopeName:
          'Anak mengenal dan memiliki perilaku positif terhadap identitas dan perannya sebagai bagian dari keluarga, sekolah, masyarakat, dan anak Indonesia sehingga dapat menyesuaikan diri dengan lingkungan, aturan, dan norma yang berlaku',
        learningScopeId: 4,
      },
      {
        subLearningScopeName:
          'Anak mengenali, mengekspresikan, dan mengelola emosi diri, serta membangun hubungan sosial secara sehat',
        learningScopeId: 5,
      },
      {
        subLearningScopeName:
          'Anak menggunakan fungsi gerak (motorik kasar, halus, dan taktil) untuk mengeksplorasi dan memanipulasi berbagai objek dan lingkungan sekitar sebagai bentuk pengembangan diri',
        learningScopeId: 6,
      },
      {
        subLearningScopeName:
          'Anak mengenali dan memahami berbagai informasi, mengomunikasikan perasaan dan pikiran secara lisan, tulisan, atau menggunakan berbagai media serta membangun percakapan',
        learningScopeId: 7,
      },
      {
        subLearningScopeName:
          'Anak menunjukkan minat, kegemaran, dan berpartisipasi dalam kegiatan pramembaca dan pramenulis',
        learningScopeId: 7,
      },

      {
        subLearningScopeName:
          'Anak memiliki kemampuan menyatakan hubungan antar bilangan dengan berbagai cara (kesadaran bilangan), mengidentifikasi pola, mengenali bentuk dan karakteristik benda di sekitar yang dapat dibandingkan dan diukur, mengklasifikasi objek, dan kesadaran mengenai waktu melalui proses eksplorasi dan pengalaman langsung dengan benda-benda konkret di lingkungan',
        learningScopeId: 8,
      },
      {
        subLearningScopeName:
          'Anak mampu menyebutkan alasan, pilihan atau keputusannya, mampu memecahkan masalah sederhana, serta mengetahui hubungan sebab akibat dari suatu kondisi atau situasi yang dipengaruhi oleh hukum alam',
        learningScopeId: 9,
      },
      {
        subLearningScopeName:
          'Anak menunjukkan rasa ingin tahu melalui observasi, eksplorasi, dan eksperimen dengan menggunakan lingkungan sekitar dan media sebagai sumber belajar untuk mendapatkan gagasan mengenai fenomena alam dan sosial',
        learningScopeId: 10,
      },
      {
        subLearningScopeName:
          'Anak menunjukkan kemampuan awal menggunakan dan merekayasa teknologi serta untuk mencari informasi, gagasan, dan keterampilan secara aman dan bertanggung jawab',
        learningScopeId: 11,
      },
      {
        subLearningScopeName:
          'Anak mengeksplorasi berbagai proses seni, mengekspresikannya, serta mengapresiasi karya seni',
        learningScopeId: 12,
      },
    ])
  }
}
