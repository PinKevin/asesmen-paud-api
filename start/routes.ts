/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const TeacherController = () => import('#controllers/teacher_controller')
const AuthController = () => import('#controllers/auth_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

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
