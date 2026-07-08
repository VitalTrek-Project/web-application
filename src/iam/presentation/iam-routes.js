const signInForm = () => import('./views/sign-in-form.vue')
const signUpForm = () => import('./views/sign-up-form.vue')

/**
 * IAM presentation routes mounted under `/iam`.
 *
 * @type {import('vue-router').RouteRecordRaw[]}
 */
const iamRoutes = [
    { path: 'sign-up', name: 'iam-sign-up', component: signUpForm, meta: { title: 'Registro' } },
    { path: 'sign-in', name: 'iam-sign-in', component: signInForm, meta: { title: 'Iniciar sesión' } }
];

export default iamRoutes;