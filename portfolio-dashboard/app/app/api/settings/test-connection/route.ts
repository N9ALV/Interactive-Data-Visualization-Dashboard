import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey } = body;

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 });
    }

    // Test the API key by making a simple request to FMP
    const testUrl = `https://financialmodelingprep.com/api/v3/quote/AAPL?apikey=${apiKey}`;
    
    const response = await fetch(testUrl);
    const data = await response.json();

    // Check if the response indicates an error
    if (data && data['Error Message']) {
      return NextResponse.json({ 
        success: false, 
        error: data['Error Message'] 
      }, { status: 400 });
    }

    // Check if we got valid data back
    if (response.ok && data && Array.isArray(data) && data.length > 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'API key is valid and working' 
      });
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Invalid response from API' 
    }, { status: 400 });

  } catch (error) {
    console.error('Error testing API connection:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to test API connection' 
    }, { status: 500 });
  }
}
