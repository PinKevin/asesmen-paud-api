import LearningScope from '#models/learning_scope'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await LearningScope.createMany([
      {
        learningScopeName: 'Nilai Agama',
        competencyId: 1,
      },
      {
        learningScopeName: 'Budi Pekerti',
        competencyId: 1,
      },
      {
        learningScopeName: 'Rasa Syukur terhadap Tuhan Yang Maha Esa',
        competencyId: 1,
      },
      {
        learningScopeName: 'Identitas Diri',
        competencyId: 2,
      },
      {
        learningScopeName: 'Sosial Emosional',
        competencyId: 2,
      },
      {
        learningScopeName: 'Fisik Motorik',
        competencyId: 2,
      },
      {
        learningScopeName: 'Literasi',
        competencyId: 3,
      },
      {
        learningScopeName: 'Matematika',
        competencyId: 3,
      },
      {
        learningScopeName: 'Sains',
        competencyId: 3,
      },
      {
        learningScopeName: 'Teknologi',
        competencyId: 3,
      },
      {
        learningScopeName: 'Rekayasa',
        competencyId: 3,
      },
      {
        learningScopeName: 'Seni',
        competencyId: 3,
      },
    ])
  }
}
