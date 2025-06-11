<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\ChatHistory;
use Illuminate\Support\Facades\Http;

class ChatController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'message' => 'required|string', // pesan user asli
        'prompt' => 'required|string',  // prompt lengkap untuk Gemini
    ]);

        // Kirim ke Gemini API
        $response = Http::withHeaders([
        'Content-Type' => 'application/json',
        'x-goog-api-key' => env('GEMINI_API_KEY'),
    ])->post('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', [
        'contents' => [
            ['parts' => [['text' => $request->prompt]]],
        ]
    ]);

        $json = $response->json();
        $textResponse = $json['candidates'][0]['content']['parts'][0]['text']
    ?? 'Tidak ada respons dari AI.';

        // Simpan ke database
        $chat = ChatHistory::create([
            'user_id' => Auth::id(),
            'title' => substr($request->message, 0, 30),
            'message' => $request->message,
            'response' => $textResponse,
        ]);

        return response()->json([
            'message' => $chat->message,
            'response' => $chat->response,
            'id' => $chat->id,
        ]);
    }

    public function history()
    {
        $histories = ChatHistory::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => (string)$item->id,
                    'title' => $item->title ?? 'Chat',
                    'lastMessage' => $item->message,
                    'timestamp' => $item->created_at->format('Y-m-d H:i'),
                    'group' => $this->groupLabel($item->created_at),
                ];
            });

        return response()->json($histories);
    }

    private function groupLabel($date)
    {
        $now = now();
        if ($date->isToday()) return 'Today';
        if ($date->isYesterday()) return 'Yesterday';
        if ($date->greaterThanOrEqualTo($now->subDays(7))) return 'Previous 7 Days';
        return 'Previous 30 Days';
    }
}
