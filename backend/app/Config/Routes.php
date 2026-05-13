<?php

$routes->setAutoRoute(false);

$routes->options('(:any)', static function () {
    return service('response')->setStatusCode(200);
});

$routes->set404Override(function ($message = null) {
    $request = service('request');

    $path = method_exists($request, 'getPath')
        ? $request->getPath()
        : $request->getUri()->getPath();

    $path = ltrim((string) $path, '/');

    $isApi = $path === 'api' || str_starts_with($path, 'api/');

    if ($isApi) {
        service('response')
            ->setStatusCode(404)
            ->setContentType('application/json');

        return json_encode([
            'status' => false,
            'message' => 'Endpoint tidak ditemukan',
            'data' => null,
        ]);
    }

    service('response')->setStatusCode(404);

    return view('errors/html/error_404', ['message' => $message]);
});

$routes->group('api', function ($routes) {
    $routes->post('login', 'Auth\AuthController::login');

    $routes->group('', ['filter' => 'jwt'], function ($routes) {
        $routes->group('user', function ($routes) {
            $routes->get('list', 'Api\UserController::index');
            $routes->post('create', 'Api\UserController::create');
            $routes->get('show/(:num)', 'Api\UserController::show/$1');
            $routes->put('edit/(:num)', 'Api\UserController::update/$1');
            $routes->delete('delete/(:num)', 'Api\UserController::delete/$1');
        });
        $routes->group('employee', function ($routes) {
            $routes->get('list', 'Api\EmployeeController::index');
            $routes->post('create', 'Api\EmployeeController::create');
            $routes->get('show/(:num)', 'Api\EmployeeController::show/$1');
            $routes->post('edit/(:num)', 'Api\EmployeeController::update/$1');
            $routes->delete('delete/(:num)', 'Api\EmployeeController::delete/$1');
        });
    });
});
