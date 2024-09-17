// app/api/query/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req , res) {
  const { query } = await req.json();
  const OPEN_API_KEY = process.env.OPEN_API_KEY;
  
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/engines/davinci-codex/completions',
      {
        prompt: query,
        max_tokens: 100,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPEN_API_KEY}`
        }
      }
    );
    console.log(response)
    // const answer = response.data.choices[0].text.trim();
    const answer = response
    return NextResponse.json({ result : answer });
  } catch (error) {
    console.error('Error fetching data from OpenAI:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }

  // const answer = response.data.choices[0].text.trim();
  // return NextResponse.json({ result : "answer"  });
 
}


