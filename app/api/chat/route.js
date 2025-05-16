import { NextResponse } from 'next/server';
import axios from 'axios';
import { JSDOM } from 'jsdom';

const CHATBOT_SERVER = 'https://kianoosh002.app.n8n.cloud/webhook/5c975944-e1e1-4fd1-8a5d-562fe2a9404a';
const WORDPRESS_POSTS = 'https://tarhenovin.com/wp-json/wp/v2/posts';

function htmlToText(html, maxLength = 500) {
  const dom = new JSDOM(html);
  const text = dom.window.document.body.textContent || '';
  const cleanText = text.trim().replace(/\s+/g, ' ');
  return cleanText.length > maxLength ? cleanText.slice(0, maxLength) + '...' : cleanText;
}

async function fetchContent(url, label) {
  let result = `📂 ${label}:\n`;
  try {
    const res = await axios.get(url, { params: { per_page: 5, page: 1 } });
    for (const item of res.data) {
      const title = item.title?.rendered || 'بدون عنوان';
      const content = htmlToText(item.content?.rendered || '');
      result += `📝 ${title}\n${content}\n\n---\n\n`;
    }
  } catch {
    result += `❌ خطا در دریافت ${label}`;
  }
  return result;
}

export async function POST(req) {
  const { message, id } = await req.json();

  if (!message) {
    return NextResponse.json({ error: 'پیامی ارسال نشده است.' }, { status: 400 });
  }

  try {
    const posts = await fetchContent(WORDPRESS_POSTS, 'پست‌ها');
    const pages = await fetchContent(WORDPRESS_PAGES, 'صفحات');
    const prompt = `${posts}\n\n${pages}\n\n❓ سوال کاربر:\n${message}`;

    const response = await axios.post(CHATBOT_SERVER, { message: prompt, id });
    return NextResponse.json({ server_response: response.data });
  } catch (error) {
    return NextResponse.json({ error: 'خطا در ارتباط با سرور چت‌بات.' }, { status: 502 });
  }
}
