export async function GET() {
  return Response.json({ success: true, message: "Pong!" });
}

export async function POST(request) {
  // Parse request body
  const body = await request.json();
  
  // Echo the request body back
  return Response.json({ 
    success: true, 
    message: "Received POST request", 
    receivedData: body 
  });
} 