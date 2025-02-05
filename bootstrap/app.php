<?php

use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\RoleMiddleware;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',          
        commands: __DIR__ . '/../routes/console.php', 
        health: '/up'                                 
    )
    ->withMiddleware(function (Middleware $middleware) {
       
        $middleware->web(append: [
            
            HandleInertiaRequests::class,
        ]);
        $middleware->alias([
            'role' => \App\Http\Middleware\RoleMiddleware::class, 
        ]);
        $middleware->alias([
            'role' => RoleMiddleware::class, 
        ]);

       
        $middleware->group('api', [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class, 
            'throttle:api',                                                         
            \Illuminate\Routing\Middleware\SubstituteBindings::class,                
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        
    })
    ->create();
