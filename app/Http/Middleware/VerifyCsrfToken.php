<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyCsrfToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        return $next($request);
    }
    protected function addCookieToResponse($request, $response)
{
    $response->headers->setCookie(
        cookie(
            'XSRF-TOKEN',
            $request->session()->token(),
            0,
            '/',
            null,
            true, 
            true, 
            false, 
            'none' 
        )
    );

    return $response;
}

}
