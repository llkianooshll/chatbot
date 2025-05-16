'use client';

import { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');
  const [id, setPhone] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponse('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, id }),
      });

      const data = await res.json();
      if (res.ok) {
        setResponse(data.server_response?.output || '✅ پاسخ دریافت شد اما خالی است.');
      } else {
        setResponse(data.error || '❌ خطایی رخ داده است.');
      }
    } catch {
      setResponse('❌ خطا در برقراری ارتباط با سرور.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-r from-indigo-600 via-purple-700 to-pink-600 flex items-center justify-center p-5">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl max-w-xl w-full p-10">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 mb-8 text-center">
          🤖 چت‌بات طرح نوین
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="phone" className="block text-gray-700 font-semibold mb-2">
              شماره تلفن<span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="مثلاً 09121234567"
              value={id}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="text-black w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-pink-400 transition"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">
              پیام شما<span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              rows={5}
              placeholder="پیام خود را وارد کنید..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="text-black w-full px-5 py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-4 focus:ring-pink-400 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold py-3 rounded-xl shadow-lg hover:from-pink-600 hover:to-red-600 active:scale-95 transition-transform disabled:opacity-60"
          >
            {loading ? '⏳ در حال ارسال...' : 'ارسال پیام'}
          </button>
        </form>

        {response && (
          <div className="mt-8 p-5 bg-pink-50 border border-pink-300 rounded-xl shadow-inner text-gray-800 whitespace-pre-wrap select-text break-words">
            <h2 className="font-bold mb-3 text-pink-600 flex items-center gap-2">
              📩 پاسخ چت‌بات:
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-3-3v6m7-8v10a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h6l4 4z" />
              </svg>
            </h2>
            <p>{response}</p>
          </div>
        )}
      </div>
    </main>
  );
}





