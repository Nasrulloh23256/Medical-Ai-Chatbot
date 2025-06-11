<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ChatController;

Route::middleware('auth')->group(function () {
    Route::post('/chat', [ChatController::class, 'store']);
    Route::get('/chat/history', [ChatController::class, 'history']);

    Route::get('/chat/{id}', function ($id) {
        return Inertia::render('app/chat', [
            'conversationId' => $id,
        ]);
    })->name('chat.view');
});
