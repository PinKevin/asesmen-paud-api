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

    router.get('/students', [StudentController, 'index'])
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
    router.get('/learning-goal-by-id/:id', [LearningGoalsController, 'getLearningGoalById'])

    router.get('/students/:id/anecdotals', [AnecdotalAssessmentsController, 'index'])
    router.post('/students/:id/anecdotals', [AnecdotalAssessmentsController, 'store'])
    router.get('/students/:id/anecdotals/:anecdotalId', [AnecdotalAssessmentsController, 'show'])
    router.put('/students/:id/anecdotals/:anecdotalId', [AnecdotalAssessmentsController, 'update'])
    router.delete('/students/:id/anecdotals/:anecdotalId', [
      AnecdotalAssessmentsController,
      'destroy',
    ])

    router.get('/students/:id/artworks', [ArtworkAssessmentsController, 'index'])
    router.post('/students/:id/artworks', [ArtworkAssessmentsController, 'store'])
    router.get('/students/:id/artworks/:artworkId', [ArtworkAssessmentsController, 'show'])
    router.put('/students/:id/artworks/:artworkId', [ArtworkAssessmentsController, 'update'])
    router.delete('/students/:id/artworks/:artworkId', [ArtworkAssessmentsController, 'destroy'])

    router.get('/students/:id/checklists', [ChecklistAssessmentsController, 'index'])
    router.post('/students/:id/checklists', [ChecklistAssessmentsController, 'store'])
    router.get('/students/:id/checklists/:checklistId', [ChecklistAssessmentsController, 'show'])
    router.put('/students/:id/checklists/:checklistId', [ChecklistAssessmentsController, 'update'])
    router.delete('/students/:id/checklists/:checklistId', [
      ChecklistAssessmentsController,
      'destroy',
    ])

    router.get('/test-guard', async () => {
      return {
        test: 'In tes penggunaan token',
      }
    })
  })
  .use(
    middleware.auth({
      guards: ['api'],
    })
  )
