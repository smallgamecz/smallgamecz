/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

 const blueprintTokenPolicy = {
  find: 'token',
  findOne: 'token',
  create: 'token',
  update: 'token',
  destroy: 'token',
  populate: 'token',
  add: 'token',
  remove: 'token',
  replace: 'token',
}

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/

  // '*': true,
  'v1/configuration/find': 'token',
  // 'v1/questioncatalogue/image': 'token', do not "token" it
  'v1/questioncatalogue/reindex': 'token',
  'v1/faker/generate': 'token',
  'v1/game/create': 'token',
  'v1/game/by-user-id': 'token',
  'v1/game/backup': 'token',
  'v1/game/restore': 'token',
  'v1/game/import': 'token',
  'v1/question/timer': 'token',
  'v1/round/running': 'token',
  'v1/round/reserve-questions': 'token',
  'v1/round/state': 'token',
  'v1/round/select-question': 'token',
  'v1/round/start': 'token',
  'v1/round/pause': 'token',
  'v1/round/state': 'token',
  'v1/round/result': 'token',
  'v1/round/end': 'token',
  'v1/round/reset': 'token',
  'v1/round/winner-by-chance': 'token',
  'v1/round/type': 'token',
};
