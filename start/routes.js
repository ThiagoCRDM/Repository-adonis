'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.post('/login', 'SessionController.store')

Route.group(() => {
  Route.post('/', 'UserController.store')
  Route.get('/', 'UserController.index').middleware(['auth'])
  Route.get('/:id', 'UserController.show').middleware(['auth'])
  Route.put('/:id', 'UserController.update').middleware(['auth'])
  Route.delete('/:id', 'UserController.destroy').middleware(['auth'])
}).prefix('/users')

Route.group(() => {
  Route.get('/', 'RepositoryController.index').middleware(['auth'])
  Route.post('/', 'RepositoryController.store').middleware(['auth'])
  Route.get('/:slug', 'RepositoryController.show').middleware(['auth'])
  Route.put('/:id', 'RepositoryController.update').middleware(['auth'])
  Route.delete(':id', 'RepositoryController.destroy').middleware(['auth'])
}).prefix('/repositories')

Route.group(() => {
  Route.get('/', 'FollowingController.index').middleware(['auth'])  
  Route.post('/', 'FollowingController.store').middleware(['auth'])
}).prefix('/followings')

Route.group(() => {
  Route.get('/', 'FollowerController.index').middleware(['auth'])
}).prefix('/followers')

Route.group(() => {
  Route.post('/', 'StarController.store').middleware(['auth'])
}).prefix('/stars')