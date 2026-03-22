import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  try {
    // Basic validation
    if (!url.includes('pinterest.com') && !url.includes('pin.it')) {
      // Sometimes it could be a direct image URL
      if (url.match(/\.(jpeg|jpg|gif|png)$/i)) {
        return NextResponse.json({ imageUrl: url });
      }
      return NextResponse.json({ error: 'Not a valid Pinterest URL' }, { status: 400 });
    }

    // Fetch the Pinterest page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch the URL' }, { status: 400 });
    }

    // If it's a shortlink (pin.it), we might be redirected. Let's get the final URL just in case
    // Though fetch handles redirects automatically

    const html = await response.text();
    const $ = cheerio.load(html);

    // Find the og:image
    let imageUrl = $('meta[property="og:image"]').attr('content');

    if (!imageUrl) {
      // Try finding the first image with class or specific attributes if og:image is missing
      imageUrl = $('img[src*="pinimg.com/"]').attr('src');
    }

    if (imageUrl) {
      // Pinterest images usually have a size in the path, e.g. /736x/ or /564x/
      // We want the original high-resolution image
      imageUrl = imageUrl.replace(/\/\d+x\//, '/originals/');
      
      return NextResponse.json({ imageUrl });
    } else {
      return NextResponse.json({ error: 'Could not find image on the page' }, { status: 404 });
    }

  } catch (error) {
    console.error('Error parsing Pinterest URL:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
