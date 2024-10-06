/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

// const UsersController = () => import('#controllers/user_controller')
const TeachersController = () => import('#controllers/teacher_controller')
import router from '@adonisjs/core/services/router'

router.get('/', async () => {
  return {
    hai: 'gais',
  }
})

router.post('/sign-up', [TeachersController, 'registerTeacher'])

// router.get('/users', [UsersController, 'index'])
// router.post('/users', [UsersController, 'store'])
// router.get('/users/:id', [UsersController, 'show'])
// router.put('/users/:id', [UsersController, 'update'])
// router.delete('/users/:id', [UsersController, 'destroy'])
