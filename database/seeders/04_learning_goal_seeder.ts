import LearningGoal from '#models/learning_goal'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await LearningGoal.createMany([
      {
        learningGoalName:
          'Anak dapat menjelaskan simbol - simbol yang merefleksikan kegiatan praktik keagamaan ( tempat ibadah, hari besar keagamaan, dan lainnya )',
        learningGoalCode: 'A1',
        subLearningScopeId: 1,
      },
      {
        learningGoalName:
          'Anak mengenal dan mempraktikan gerakan dan bacaan sholat secara bertahap',
        learningGoalCode: 'A2',
        subLearningScopeId: 1,
      },
      {
        learningGoalName: 'Anak mengenal dan melaksanakan gerakan dan bacaan rukun wudhu',
        learningGoalCode: 'A3',
        subLearningScopeId: 1,
      },
      {
        learningGoalName: 'Mengucapkan kalimat thoyibah dalam keseharian',
        learningGoalCode: 'A4',
        subLearningScopeId: 1,
      },
      {
        learningGoalName: 'Anak menghafalkan 14 surat pendek dalam juz amma',
        learningGoalCode: 'A5',
        subLearningScopeId: 1,
      },
      {
        learningGoalName: ' Anak mengenal huruf Hijaiyah',
        learningGoalCode: 'A6',
        subLearningScopeId: 1,
      },
      {
        learningGoalName: 'Anak mengenal dan memahami nabi dan rasul',
        learningGoalCode: 'A7',
        subLearningScopeId: 1,
      },
      {
        learningGoalName: 'Anak mengenal rukun Islam',
        learningGoalCode: 'A8',
        subLearningScopeId: 1,
      },
      {
        learningGoalName: 'Mengenal rukun iman',
        learningGoalCode: 'A9',
        subLearningScopeId: 1,
      },
      {
        learningGoalName: 'Anak mengenal bacaan doa dalam aktivitas harian',
        learningGoalCode: 'A10',
        subLearningScopeId: 1,
      },
      {
        learningGoalName:
          'Anak menunjukkan sikap meneladani sifat rasulullah (bersyukur, jujur, tanggung jawab, sopan, hormat)',
        learningGoalCode: 'A11',
        subLearningScopeId: 1,
      },
      {
        learningGoalName: 'Anak mengenal nama agama dan tempat ibadah agama lain',
        learningGoalCode: 'A12',
        subLearningScopeId: 2,
      },
      {
        learningGoalName: 'Anak menunjukan sikap menghormati dan toleransi orang lain',
        learningGoalCode: 'A13',
        subLearningScopeId: 2,
      },
      {
        learningGoalName: 'Anak menunjukkan sikap sopan santun, mau berbagi dengan orang lain',
        learningGoalCode: 'A14',
        subLearningScopeId: 2,
      },
      {
        learningGoalName: 'Anak menunjukan sikap sopan dalam berbicara dan bertindak',
        learningGoalCode: 'A15',
        subLearningScopeId: 2,
      },
      {
        learningGoalName:
          'Anak menunjukkan kemampuan mengelola emosi dengan antri, menunggu, berbagi, menunda dalam berbagai kegiatan sehari-hari',
        learningGoalCode: 'A16',
        subLearningScopeId: 2,
      },
      {
        learningGoalName:
          'Anak menunjukkan sikap untuk menyayangi makhluk hidup ciptaan Allah (manusia, binatang, dan tumbuhan)',
        learningGoalCode: 'A17',
        subLearningScopeId: 3,
      },
      {
        learningGoalName: 'Anak menjaga kebersihan dan merawat lingkungan sekitar karunia Allah',
        learningGoalCode: 'A18',
        subLearningScopeId: 3,
      },
      {
        learningGoalName:
          'Anak mampu membedakan perbuatan baik dan buruk dalam merawat lingkungan alam, fisik, dan sosial',
        learningGoalCode: 'A19',
        subLearningScopeId: 3,
      },
      {
        learningGoalName:
          'Anak mampu menunjukkan kepedulian terhadap tanggung jawab menjaga lingkungan sekitar',
        learningGoalCode: 'A20',
        subLearningScopeId: 3,
      },
      {
        learningGoalName:
          'Anak mampu menjaga kebersihan diri dengan mencuci tangan, mandi, gosok gigi, dan menjaga kebersihan diri',
        learningGoalCode: 'A21',
        subLearningScopeId: 4,
      },
      {
        learningGoalName: 'Anak menunjukkan kesediaan untuk mengonsumsi makanan sehat dan bergizi',
        learningGoalCode: 'A22',
        subLearningScopeId: 4,
      },
      {
        learningGoalName: 'Anak melakukan aktivitas olahraga untuk menjaga kesehatan',
        learningGoalCode: 'A23',
        subLearningScopeId: 4,
      },
      {
        learningGoalName:
          'Anak mampu mengkoordinasikan motorik halus dan kasar dalam berbagai kegiatan',
        learningGoalCode: 'A24',
        subLearningScopeId: 4,
      },
      {
        learningGoalName: 'Anak mampu menjaga keselamatan dirinya dengan berhati-hati',
        learningGoalCode: 'A25',
        subLearningScopeId: 4,
      },
      {
        learningGoalName:
          'Anak mampu memiliki rasa positif terhadap dirinya untuk membangun kepercayaan diri',
        learningGoalCode: 'J1',
        subLearningScopeId: 5,
      },
      {
        learningGoalName: 'Anak mampu mengidentifikasi nilai-nilai positif dalam keluarga',
        learningGoalCode: 'J2',
        subLearningScopeId: 5,
      },
      {
        learningGoalName: 'Anak mampu mengenali identitas diri dan keluarga melalui budayanya',
        learningGoalCode: 'J3',
        subLearningScopeId: 5,
      },
      {
        learningGoalName:
          'Anak mampu menunjukkan rasa ingin tahu terhadap budaya yang berbeda dan bertoleransi',
        learningGoalCode: 'J4',
        subLearningScopeId: 5,
      },
      {
        learningGoalName:
          'Anak mampu memiliki perilaku yang mencerminkan rasa percaya diri, mandiri dan menyesuaikan dengan lingkungan',
        learningGoalCode: 'J5',
        subLearningScopeId: 6,
      },
      {
        learningGoalName:
          'Anak mampu mengenal identitas Indonesia dan bangga menjadi anak Indonesia',
        learningGoalCode: 'J6',
        subLearningScopeId: 6,
      },
      {
        learningGoalName: 'Anak mampu menunjukkan sikap empati dengan kejadian/ orang lain',
        learningGoalCode: 'J7',
        subLearningScopeId: 6,
      },
      {
        learningGoalName: 'Anak mampu mengenal macam – macam emosi yang dirasakan dan penyebabnya',
        learningGoalCode: 'J8',
        subLearningScopeId: 7,
      },
      {
        learningGoalName:
          'Anak mampu mengenali emosi orang – orang terdekat melalui kemampuan identifikasi ekspresi wajah yang ditunjukan',
        learningGoalCode: 'J9',
        subLearningScopeId: 7,
      },
      {
        learningGoalName:
          'Anak mampu mengelola perasaan Ketika marah, sedih dan gembira secara wajar',
        learningGoalCode: 'J10',
        subLearningScopeId: 7,
      },
      {
        learningGoalName: 'Anak mampu bekerja sama dengan kelompok',
        learningGoalCode: 'J11',
        subLearningScopeId: 7,
      },
      {
        learningGoalName:
          'Anak mampu mengkoordinasikan Gerakan motorik kasar, motorik halus dan taktil',
        learningGoalCode: 'J12',
        subLearningScopeId: 8,
      },
      {
        learningGoalName:
          'Anak mampu memanfaatkan Gerakan motorik dalam eksplorasi dan manipulasi objek – objek di sekitar',
        learningGoalCode: 'J13',
        subLearningScopeId: 8,
      },
      {
        learningGoalName:
          'Anak mampu menggunakan indera dan anggota tubuh untuk eksplorasi objek – objek di sekitarnya',
        learningGoalCode: 'J14',
        subLearningScopeId: 8,
      },
      {
        learningGoalName:
          'Anak mampu menyimak dan merespon informasi dari orang lain lingkungan sekitar melalui berbagai media',
        learningGoalCode: 'L1',
        subLearningScopeId: 9,
      },
      {
        learningGoalName:
          'Anak mampu memahami arti dan informasi dari gambar, tanda  atau simbol (termasuk angka dan huruf) dan cerita',
        learningGoalCode: 'L2',
        subLearningScopeId: 9,
      },
      {
        learningGoalName: 'Anak mampu menyampaikan ide dan gagasannya melalui berbagai media',
        learningGoalCode: 'L3',
        subLearningScopeId: 9,
      },
      {
        learningGoalName: 'Anak mampu mengkomunikasikan pikiran dan perasaan secara tepat',
        learningGoalCode: 'L4',
        subLearningScopeId: 9,
      },
      {
        learningGoalName:
          'Anak mampu merespon secara tepat dalam komunikasi dua arah dan terlibat dalam percakapan',
        learningGoalCode: 'L5',
        subLearningScopeId: 9,
      },
      {
        learningGoalName:
          'Anak mampu mengingat dan menyebutkan peristiwa, tokoh, informasi dalam sebuah cerita',
        learningGoalCode: 'L6',
        subLearningScopeId: 10,
      },
      {
        learningGoalName:
          'Anak mampu menyebutkan ciri-ciri khusus dalam suatu obyek yang diobservasi',
        learningGoalCode: 'L7',
        subLearningScopeId: 10,
      },
      {
        learningGoalName:
          'Anak mampu bertanya dan bercakap-cakap tentang cerita buku atau media lainnya',
        learningGoalCode: 'L8',
        subLearningScopeId: 10,
      },
      {
        learningGoalName:
          'Anak mampu mengenali fonik huruf dan menghubungkan dengan obyek tertentu',
        learningGoalCode: 'L9',
        subLearningScopeId: 10,
      },
      {
        learningGoalName: 'Anak mampu mengkomunikasikan cerita / informasi yang diperolehnya',
        learningGoalCode: 'L10',
        subLearningScopeId: 10,
      },
      {
        learningGoalName: 'Anak mampu menulis nama dan kata sederhana',
        learningGoalCode: 'L11',
        subLearningScopeId: 10,
      },
      {
        learningGoalName:
          'Anak mampu menuliskan ide dan gagasan dalam bentuk coretan gambar atau tulisan',
        learningGoalCode: 'L12',
        subLearningScopeId: 10,
      },
      {
        learningGoalName: 'Anak menunjukkan kegemarannya dalam buku',
        learningGoalCode: 'L13',
        subLearningScopeId: 10,
      },
      {
        learningGoalName: 'Anak mampu mengenal pola, simbol dan data yang diamati',
        learningGoalCode: 'L14',
        subLearningScopeId: 11,
      },
      {
        learningGoalName: 'Anak mampu membilang jumlah benda dengan angka',
        learningGoalCode: 'L15',
        subLearningScopeId: 11,
      },
      {
        learningGoalName: 'Anak mampu memprediksi dan mengurutkan pola urutan simbol atau gambar',
        learningGoalCode: 'L16',
        subLearningScopeId: 11,
      },
      {
        learningGoalName:
          'Anak mampu membedakan, mengelompokkan objek berdasarkan karakteristiknya (bentuk, warna, ukuran, jarak, dsb)',
        learningGoalCode: 'L17',
        subLearningScopeId: 11,
      },
      {
        learningGoalName: 'Memecahkan masalah sederhana dalam kehidupan sehari-hari',
        learningGoalCode: 'L18',
        subLearningScopeId: 11,
      },
      {
        learningGoalName:
          'Anak mampu melakukan kegiatan observasi, eksplorasi dan eksperimen dengan bahan sekitar',
        learningGoalCode: 'L19',
        subLearningScopeId: 12,
      },
      {
        learningGoalName:
          'Anak mampu menceritakan pengalaman kegiatan observasi, eksplorasi, dan eksperimen dengan bahasanya sendiri sesuai pemahamannya',
        learningGoalCode: 'L20',
        subLearningScopeId: 12,
      },
      {
        learningGoalName:
          'Anak mampu terlibat dalam uji coba, membuat prediksi dan mendapatkan pengetahuannya',
        learningGoalCode: 'L21',
        subLearningScopeId: 12,
      },
      {
        learningGoalName:
          'Anak mampu mengajukan pertanyaan mengapa dan apa saja yang menyebabkan suatu peristiwa/kejadian',
        learningGoalCode: 'L22',
        subLearningScopeId: 12,
      },
      {
        learningGoalName:
          'Anak mampu mengenal dan mendemonstrasikan teknologi yang ada di lingkungan sekitar',
        learningGoalCode: 'L23',
        subLearningScopeId: 13,
      },
      {
        learningGoalName:
          'Anak mampu menunjukkan kemampuan menggunakan teknologi sederhana dalam kehidupan sehari-hari',
        learningGoalCode: 'L24',
        subLearningScopeId: 13,
      },
      {
        learningGoalName:
          'Anak mampu merancang teknologi dengan media yang tersedia di lingkungan sekitar',
        learningGoalCode: 'L25',
        subLearningScopeId: 13,
      },
      {
        learningGoalName:
          'Anak mengenal dan menyebutkan alat komunikasi, transportasi, teknologi secara sederhana',
        learningGoalCode: 'L26',
        subLearningScopeId: 14,
      },
      {
        learningGoalName: 'Anak mengenal dan menggunakan teknologi sederhana',
        learningGoalCode: 'L27',
        subLearningScopeId: 14,
      },
      {
        learningGoalName:
          'Anak menggunakan informasi yang diperolehnya untuk mewujudkan idenya dalam sebuah karya',
        learningGoalCode: 'L28',
        subLearningScopeId: 14,
      },
      {
        learningGoalName:
          'Anak mengenal tata cara menggunakan teknologi secara aman dan bertanggung jawab',
        learningGoalCode: 'L29',
        subLearningScopeId: 14,
      },
      {
        learningGoalName:
          'Anak mampu mengenal berbagai aktivitas seni dengan berbagai media (menyanyi, menari, melukis, menggambar, kriya, bermain peran, dll)',
        learningGoalCode: 'L30',
        subLearningScopeId: 15,
      },
      {
        learningGoalName:
          'Anak mampu menunjukkan kemampuan kreativitas seni dan imajinasi dengan menggunakan berbagai media (menyanyi, permainan tradisional, drama, bentuk benda, mewarnai, melukis)',
        learningGoalCode: 'L31',
        subLearningScopeId: 15,
      },
      {
        learningGoalName: 'Anak mampu menunjukkan perasaan terhadap kegiatan dan hasil karya seni',
        learningGoalCode: 'L32',
        subLearningScopeId: 15,
      },
    ])
  }
}
