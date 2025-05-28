import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Pin from '../../../models/Pin';

export async function GET() {
  try {
    await connectDB();
    const pins = await Pin.find().sort({ createdAt: -1 });
    return NextResponse.json(pins);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch pins' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    await connectDB();
    const pin = await Pin.create(body);
    return NextResponse.json(pin);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create pin' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id, userId } = await request.json();
    await connectDB();
    const pin = await Pin.findOne({ _id: id });
    
    if (!pin) {
      return NextResponse.json({ error: 'Pin not found' }, { status: 404 });
    }
    
    if (pin.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    await Pin.deleteOne({ _id: id });
    return NextResponse.json({ message: 'Pin deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete pin' }, { status: 500 });
  }
} 