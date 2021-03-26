
const routes = [
  {
    path: '/',
    component: () => import('layouts/HomepageLayout.vue'),
    children: [
      { path: '', name: 'homepage', component: () => import('pages/Homepage.vue'), meta: { guest: true } }
    ]
  },

  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    children: [
      { path: '', name: 'admin.dashboard', component: () => import('pages/admin/Dashboard.vue'), meta: { admin: true } }
    ]
  },

  {
    path: '/create',
    component: () => import('layouts/BlankLayout.vue'),
    children: [
      { path: '', name: 'game.create', component: () => import('pages/CreateGame.vue'), meta: { guest: true } }
    ]
  },

  {
    path: '/panel',
    component: () => import('layouts/VerifyLayout.vue'),
    children: [
      { path: 'verify', name: 'panel.verify', component: () => import('pages/panel/VerifyGame.vue') }
    ]
  },

  {
    path: '/panel',
    component: () => import('layouts/PanelLayout.vue'),
    children: [
      { path: ':id/dashboard', name: 'panel.dashboard', component: () => import('pages/panel/Dashboard.vue'), meta: { auth: true } },
      { path: ':id/questions', name: 'panel.questions', component: () => import('pages/panel/Questions.vue'), meta: { auth: true } },
      { path: ':id/questions/new', name: 'panel.questions.new', component: () => import('pages/panel/QuestionsForm.vue'), meta: { auth: true } },
      { path: ':id/questions/import', name: 'panel.questions.import', component: () => import('pages/panel/QuestionsImportForm.vue'), meta: { auth: true } },
      { path: ':id/questions/:question', name: 'panel.questions.edit', component: () => import('pages/panel/QuestionsForm.vue'), meta: { edit: true, auth: true } },
      { path: ':id/rounds', name: 'panel.rounds', component: () => import('pages/panel/Rounds.vue'), meta: { auth: true } },
      { path: ':id/rules', name: 'panel.rules', component: () => import('pages/panel/Rules.vue'), meta: { auth: true } },
      { path: ':id/importexport', name: 'panel.backuprestore', component: () => import('pages/panel/BackupRestore.vue'), meta: { auth: true } },
      { path: ':id/delete', name: 'panel.delete', component: () => import('pages/panel/Delete.vue'), meta: { auth: true } }
    ]
  },

  {
    path: '/panel/:id/rounds/:round?/moderator',
    component: () => import('layouts/PlayLayout'),
    children: [
      { path: '', name: 'panel.moderator', component: () => import('pages/panel/Moderator.vue'), meta: { auth: true } }
    ]
  },

  {
    path: '/panel/:id/rounds/:round/player',
    component: () => import('layouts/PlayLayout'),
    children: [
      { path: '', name: 'panel.player', component: () => import('pages/panel/Player.vue'), meta: { auth: true } }
    ]
  },

  {
    path: '/panel/:id/rounds/:round/winner',
    component: () => import('layouts/PlayLayout'),
    children: [
      { path: '', name: 'panel.winner', component: () => import('pages/panel/Winner.vue'), meta: { auth: true } }
    ]
  },

  {
    path: '/server-error',
    component: () => import('pages/Error500.vue'),
    name: 'error.500',
    meta: { auth: false }
  },

  {
    path: '/game-not-found',
    component: () => import('pages/ErrorGame404.vue'),
    name: 'game.404',
    meta: { auth: false }
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue'),
    meta: { auth: false }
  }
]

export default routes
