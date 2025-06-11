<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\Api\AuthApiController;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\VoucherController;


Route::get('/test-gemini-key', function () {
    return response()->json([
        'GEMINI_API_KEY' => env('GEMINI_API_KEY'),
    ]);
});

Route::post('/login', [AuthApiController::class, 'login']);
Route::post('/register', [AuthApiController::class, 'register']);


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/chat/histories', [ChatController::class, 'listHistories']);
    Route::post('/chat/history', [ChatController::class, 'createHistory']);
    Route::get('/chat/{conversationId}/messages', [ChatController::class, 'getMessages']);
    Route::post('/chat/{conversationId}/send', [ChatController::class, 'sendMessageToConversation']);
    Route::get('/doctors/nearby', [DoctorController::class, 'nearby']);
    Route::post('/vouchers/redeem', [VoucherController::class, 'redeem'])->name('vouchers.redeem');
    Route::post('/logout', [AuthApiController::class, 'logout']);
});
