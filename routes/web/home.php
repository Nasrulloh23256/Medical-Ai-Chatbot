<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth'])->group(function () {
    Route::get('/chat', function () {
        return Inertia::render('app/home');
    })->name('home');

    Route::get('/chat/example', function () {
        return Inertia::render('app/with-chat-history-example');
    })->name('chat-example');
});

