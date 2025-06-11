<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth'])->group(function () {
    Route::get('/upgrade-plan', function () {
        return Inertia::render('app/upgrade-plan');
    })->name('upgrade-plan');
});
