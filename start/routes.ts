/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const FilesController = () => import('#controllers/files_controller')
const ReportPrintHistoriesController = () =>
  import('#controllers/report_print_histories_controller')
const SeriesPhotoAssessmentsController = () =>
  import('#controllers/series_photo_assessment_controller')
const ChecklistAssessmentsController = () => import('#controllers/checklist_assessment_controller')
const ArtworkAssessmentsController = () => import('#controllers/artwork_assessment_controller')
const LearningGoalsController = () => import('#controllers/learning_goals_controller')
const TeacherController = () => import('#controllers/teacher_controller')
const AuthController = () => import('#controllers/auth_controller')
const StudentController = () => import('#controllers/student_controller')
const AnecdotalAssessmentsController = () => import('#controllers/anecdotal_assessment_controller')

router.get('/', async () => {
  return {
    hai: 'gais',
  }
})

router.post('/sign-up', [TeacherController, 'registerTeacher'])
router.put('/complete-sign-up/:id', [TeacherController, 'completeTeacherAfterRegister'])
router.post('/sign-in', [AuthController, 'login'])

router
  .group(() => {
    router.get('/check-token', [AuthController, 'checkAuthenticaton'])
    router.post('/sign-out', [AuthController, 'logout'])
    router.get('/profile', [AuthController, 'getProfile'])

    router.get('/classes', [TeacherController, 'getTeacherClasses'])

    router.get('/competencies', [LearningGoalsController, 'getAllCompetencies'])
    router.get('/learning-scopes/:competencyId', [
      LearningGoalsController,
      'getLearningScopesByCompetencyId',
    ])
    router.get('/sub-learning-scopes/:learningScopeId', [
      LearningGoalsController,
      'getSubLearningScopesByLearningScopeId',
    ])
    router.get('/learning-goals/:subLearningScopeId', [
      LearningGoalsController,
      'getLearningGoalsBySubLearningScopeId',
    ])

    router.get('/competency-by-id/:id', [LearningGoalsController, 'getCompetencyById'])
    router.get('/learning-scope-by-id/:id', [LearningGoalsController, 'getLearningScopeById'])
    router.get('/sub-learning-scope-by-id/:id', [
      LearningGoalsController,
      'getSubLearningScopeById',
    ])
    router.get('/learning-goal-by-id/:id', [LearningGoalsController, 'getLearningGoalById'])

    router.post('/upload-photo', [FilesController, 'uploadPhoto'])
    router.get('/get-photo/:fileName', [FilesController, 'getPhoto'])

    router
      .group(() => {
        router.get('/', [StudentController, 'index'])
        router.post('/', [StudentController, 'store'])
        router.get('/:id', [StudentController, 'getStudentInfo'])
        router.put('/:id', [StudentController, 'update'])
        router.delete('/:id', [StudentController, 'destroy'])

        router
          .group(() => {
            router.get('/', [AnecdotalAssessmentsController, 'index'])
            router.post('/', [AnecdotalAssessmentsController, 'store'])
            router.get('/:anecdotalId', [AnecdotalAssessmentsController, 'show'])
            router.put('/:anecdotalId', [AnecdotalAssessmentsController, 'update'])
            router.delete('/:anecdotalId', [AnecdotalAssessmentsController, 'destroy'])
          })
          .prefix('/:id/anecdotals')

        router
          .group(() => {
            router.get('/', [ArtworkAssessmentsController, 'index'])
            router.post('/', [ArtworkAssessmentsController, 'store'])
            router.get('/:artworkId', [ArtworkAssessmentsController, 'show'])
            router.put('/:artworkId', [ArtworkAssessmentsController, 'update'])
            router.delete('/:artworkId', [ArtworkAssessmentsController, 'destroy'])
          })
          .prefix('/:id/artworks')

        router
          .group(() => {
            router.get('/', [ChecklistAssessmentsController, 'index'])
            router.post('/', [ChecklistAssessmentsController, 'store'])
            router.get('/:checklistId', [ChecklistAssessmentsController, 'show'])
            router.put('/:checklistId', [ChecklistAssessmentsController, 'update'])
            router.delete('/:checklistId', [ChecklistAssessmentsController, 'destroy'])
          })
          .prefix('/:id/checklists')

        router
          .group(() => {
            router.get('/', [SeriesPhotoAssessmentsController, 'index'])
            router.post('/', [SeriesPhotoAssessmentsController, 'store'])
            router.get('/:seriesPhotoId', [SeriesPhotoAssessmentsController, 'show'])
            router.put('/:seriesPhotoId', [SeriesPhotoAssessmentsController, 'update'])
            router.delete('/:seriesPhotoId', [SeriesPhotoAssessmentsController, 'destroy'])
          })
          .prefix('/:id/series-photos')

        router
          .group(() => {
            router.get('/', [ReportPrintHistoriesController, 'indexReport'])
            router.post('/create-report', [
              ReportPrintHistoriesController,
              'createAndDownloadReport',
            ])
            router.get('/:reportId', [ReportPrintHistoriesController, 'showReport'])
            router.get('/:reportId/download-report', [
              ReportPrintHistoriesController,
              'downloadExistingReport',
            ])
            router.delete('/:reportId', [ReportPrintHistoriesController, 'destroy'])
          })
          .prefix('/:id/reports')
      })
      .prefix('/students')
  })
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )
