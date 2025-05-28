import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { title, lat, lng } = await request.json();

    const prompt = `Given a location with title "${title}" at coordinates (${lat}, ${lng}), 
    suggest a brief, engaging description for this pin on a map. Consider the type of location 
    and its potential significance. Keep it under 100 words.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates concise, informative descriptions for map locations.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const suggestion = completion.choices[0].message.content;
    return NextResponse.json({ suggestion });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate description' },
      { status: 500 }
    );
  }
} 