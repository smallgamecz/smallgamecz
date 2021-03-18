/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

const routes = {

  /***************************************************************************
   *                                                                          *
   * More custom routes here...                                               *
   * (See https://sailsjs.com/config/routes for examples.)                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the routes in this file, it   *
   * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
   * not match any of those, it is matched against static assets.             *
   *                                                                          *
   ***************************************************************************/

  //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
  //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
  //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝

  //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
  //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
  //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝

  //  ╔╦╗╦╔═╗╔═╗
  //  ║║║║╚═╗║
  //  ╩ ╩╩╚═╝╚═╝

  'GET /': 'index',
  'GET /status': 'index',
  'GET /v1/status': 'index',

  'GET /v1/game': {
    response: 'notFound'
  },
  'POST /v1/game': 'v1/game/create',
  'POST /v1/game/:id/backup': 'v1/game/backup',
  'POST /v1/game/:id/restore': 'v1/game/restore',
  'POST /v1/game/:id/import': 'v1/game/import',
  'GET /v1/game/verify/:url': 'v1/game/verify',
  'GET /v1/question': 'v1/question/find',
  'GET /v1/question/:id': 'v1/question/find',
  'PATCH /v1/question/:id/timer/:timer': 'v1/question/timer',

  'GET /v1/round/running': 'v1/round/running',
  'GET /v1/round/state': 'v1/round/state',
  'GET /v1/round/type': 'v1/round/type',
  'GET /v1/round/:round/reserve-questions': 'v1/round/reserve-questions',
  'PATCH /v1/round/:round/select-question/:question': 'v1/round/select-question',
  'POST /v1/round/:round/winner-by-chance/:question': 'v1/round/winner-by-chance',
  'PATCH /v1/round/:round/result': 'v1/round/result',
  'PATCH /v1/round/:id/start': 'v1/round/start',
  'PATCH /v1/round/:id/pause': 'v1/round/pause',
  'GET /v1/round/:id/state': 'v1/round/state',
  'PATCH /v1/round/:round/end': 'v1/round/end',
  'PATCH /v1/round/:round/reset': 'v1/round/reset',
}

if (process.env.NODE_ENV === 'development') {
  // enable "find all route"
  delete routes['GET /v1/game']

  // enable data faker on the endpoint
  routes['POST /v1/faker'] = 'v1/faker/generate'
}

module.exports.routes = routes
