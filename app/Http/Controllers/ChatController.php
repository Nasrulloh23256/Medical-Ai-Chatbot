<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;

class ChatController extends Controller
{

    protected function getDayGroup(\Carbon\Carbon $date)
    {
        $now = now();
        if ($date->isToday()) {
            return 'Hari ini';
        } elseif ($date->isYesterday()) {
            return 'Kemarin';
        } elseif ($date->greaterThanOrEqualTo($now->copy()->startOfWeek())) {
            return 'Minggu ini';
        } elseif ($date->month === $now->month && $date->year === $now->year) {
            return 'Bulan ini';
        }
        return 'Lama';
    }

    // [1] List semua history/conversation milik user (history list)
    public function listHistories(Request $request)
    {
        $user = $request->user();
        $histories = Conversation::where('user_id', $user->id)
            ->whereHas('messages', function($q) {
                $q->where('sender', 'user');
            })
            ->with(['messages' => function($q) {
                $q->where('sender', 'user')->orderBy('created_at', 'asc');
            }])
            ->orderBy('updated_at', 'desc')
            ->get();

        $result = $histories->map(function($conv) {
            $firstUserMsg = $conv->messages->first();
            $date = $conv->updated_at ?? $conv->created_at;
            return [
                'id'         => $conv->id,
                'title'      => $firstUserMsg ? mb_strimwidth($firstUserMsg->message, 0, 40, "...") : $conv->title,
                'lastMessage'=> $firstUserMsg ? $firstUserMsg->message : '',
                'timestamp'  => $date,
                'group'      => $this->getDayGroup(new Carbon($date)),
            ];
        });

        return response()->json(['histories' => $result]);
    }




    // [2] Buat percakapan/history baru
    public function createHistory(Request $request)
    {
        $request->validate(['title' => 'required|string|max:255']);
        $user = $request->user();

        $conversation = Conversation::create([
            'user_id' => $user->id,
            'title' => $request->title,
        ]);

        return response()->json(['conversation' => $conversation]);
    }

    // [3] Tampilkan semua pesan pada satu conversation/history
    public function getMessages(Request $request, $conversationId)
    {
        $user = $request->user();
        $conversation = Conversation::where('id', $conversationId)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $messages = $conversation->messages()->orderBy('created_at')->get();

        return response()->json(['messages' => $messages]);
    }

    // [4] Kirim pesan ke AI pada satu conversation/history tertentu
public function sendMessageToConversation(Request $request, $conversationId)
{
    $request->validate(['message' => 'required|string']);
    $user = $request->user();
    $conversation = Conversation::where('id', $conversationId)
        ->where('user_id', $user->id)
        ->firstOrFail();

    // Update title dengan pesan user (maks 40 karakter misal)
    $titlePreview = mb_strimwidth($request->message, 0, 40, "...");
    $conversation->update(['title' => $titlePreview]);

    // Simpan pesan user
    $userMessage = $conversation->messages()->create([
        'sender' => 'user',
        'message' => $request->message,
    ]);

    // Kirim ke Gemini AI dan simpan balasan
    $aiReply = $this->callGeminiApi($request->message, $conversation);
    $aiMessage = $conversation->messages()->create([
        'sender' => 'ai',
        'message' => $aiReply,
    ]);

    return response()->json([
        'messages' => [
            $userMessage,
            $aiMessage,
        ]
    ]);
}


    protected function callGeminiApi($message, $conversation)
{
    $apiKey = env('GEMINI_API_KEY');
    $apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={$apiKey}";

    // System prompt: instruksi AI selalu dalam markdown, ramah, dsb
    $systemPrompt = [
        'role' => 'user',
        'parts' => [[
            'text' => "Kamu adalah AI asisten kesehatan profesional. Selalu balas dalam bahasa Indonesia dengan gaya ramah, singkat, jelas, dan gunakan format **Markdown**. Jika menjawab, gunakan bullet point, heading, atau tabel jika relevan. Jangan gunakan bahasa Inggris. Jika pertanyaan di luar tema kesehatan, balas dengan sopan bahwa kamu hanya bisa menjawab seputar kesehatan."
        ]]
    ];

    // Riwayat chat sebelumnya
    $history = $conversation->messages()
        ->orderBy('created_at')
        ->get()
        ->map(function ($msg) {
            return [
                'role' => $msg->sender === 'user' ? 'user' : 'model',
                'parts' => [ ['text' => $msg->message] ]
            ];
        })->toArray();

    // Gabungkan system prompt + history + pesan terbaru
    $allHistory = array_merge([ $systemPrompt ], $history);
    $allHistory[] = [
        'role' => 'user',
        'parts' => [ ['text' => $message] ]
    ];

    // Panggil Gemini
    $response = \Http::post($apiUrl, [
        'contents' => $allHistory
    ]);

    if ($response->successful()) {
        $data = $response->json();
        return $data['candidates'][0]['content']['parts'][0]['text'] ?? 'Maaf, AI tidak bisa menjawab.';
    } else {
        \Log::error('Gemini API error', [
            'body' => $response->body(),
            'status' => $response->status()
        ]);
        return 'Maaf, terjadi error pada AI.';
    }
}

}
