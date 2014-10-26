/** 
 * Routes for the application
 */

Hembu.router.route('login', {path:'/login', layoutTemplate:'blue-layout'});
Hembu.router.route('signup', {path:'/signup', layoutTemplate:'blue-layout'});
Hembu.router.route('welcome', {path:'/welcome', layoutTemplate:'blue-layout'});


Hembu.router.route('profile', {path: '/profile'});
Hembu.router.route('home', {path:'/:address?', controller: 'HomeController'});
Hembu.router.route('home', {path:'/:address?/board/:board?', controller: 'HomeController'});
Hembu.router.route('post', {path: '/:address/board/:board/post'});
Hembu.router.route('address', {path: '/:address/edit'});
Hembu.router.route('notice', {path:'/:address/board/:board/read/:notice', controller: 'BlankHomeController'});
