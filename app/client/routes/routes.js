/** 
 * Routes for the application
 */

Hembu.router.route('login', {path:'/login'});
Hembu.router.route('signup', {path:'/signup'});
Hembu.router.route('welcome', {path:'/welcome'});
Hembu.router.route('profile', {path: '/profile'});

Hembu.router.route('home', {path:'/:address?/:board?', controller: 'HomeController'});
Hembu.router.route('post', {path: '/:address/:board/post'});
Hembu.router.route('notice', {path:'/:address/:board/read/:notice', controller: 'BlankHomeController'});
