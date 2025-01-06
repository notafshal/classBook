<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'], // Include your API routes and CSRF route
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost'], // Add your Vite frontend URL
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true, // Enable credentials
];
