<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/hospitals', function () {
    return Inertia::render('app/hospitals');
});

