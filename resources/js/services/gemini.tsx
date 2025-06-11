import axios from 'axios';

export async function askGemini(prompt: string, userMessage: string): Promise<string> {
    try {
        const response = await axios.post('/chat', { message: userMessage, prompt });
        return response.data.response;
    } catch (error) {
        console.error('Gagal mendapatkan respons dari server:', error);
        throw new Error('Terjadi kesalahan saat memproses chat.');
    }
}
