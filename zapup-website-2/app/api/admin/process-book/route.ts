import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Process book API called');
    
    // Get form data from the request
    const formData = await request.formData();
    
    // Extract and validate data
    const requestData = {
      book_title: formData.get('book_title') as string,
      class_level: formData.get('class_level') as string,
      school_type: formData.get('school_type') as string,
      subject: formData.get('subject') as string,
      stream: formData.get('stream') as string,
      state: formData.get('state') as string,
      school_name: formData.get('school_name') as string,
      chapter_number: formData.get('chapter_number') as string,
      chapter_name: formData.get('chapter_name') as string
    };

    // Handle PDF file with detailed debugging
    const pdfFile = formData.get('pdf_file') as File | null;
    
    console.log('📁 PDF File Debug Info:', {
      exists: !!pdfFile,
      name: pdfFile?.name,
      size: pdfFile?.size,
      type: pdfFile?.type,
      constructor: pdfFile?.constructor?.name,
      hasStream: pdfFile ? typeof pdfFile.stream === 'function' : false,
      hasArrayBuffer: pdfFile ? typeof pdfFile.arrayBuffer === 'function' : false
    });

    // Validate required fields with detailed error reporting
    const missingFields = [];
    if (!requestData.book_title) missingFields.push('book_title');
    if (!requestData.class_level) missingFields.push('class_level');
    if (!requestData.school_type) missingFields.push('school_type');
    if (!requestData.subject) missingFields.push('subject');
    if (!requestData.state) missingFields.push('state');
    if (!requestData.school_name) missingFields.push('school_name');
    if (!requestData.chapter_number) missingFields.push('chapter_number');
    if (!requestData.chapter_name) missingFields.push('chapter_name');
    if (!pdfFile) missingFields.push('pdf_file');

    if (missingFields.length > 0) {
      console.error('❌ Missing required fields:', missingFields);
      console.error('❌ Received data:', {
        book_title: requestData.book_title ? '✓' : '✗',
        class_level: requestData.class_level ? '✓' : '✗', 
        school_type: requestData.school_type ? '✓' : '✗',
        subject: requestData.subject ? '✓' : '✗',
        state: requestData.state ? '✓' : '✗',
        school_name: requestData.school_name ? '✓' : '✗',
        chapter_number: requestData.chapter_number ? '✓' : '✗',
        chapter_name: requestData.chapter_name ? '✓' : '✗',
        pdf_file: pdfFile ? '✓' : '✗'
      });
      return NextResponse.json(
        { 
          error: `Missing required fields: ${missingFields.join(', ')}`,
          details: 'Please ensure all required fields are filled in the form.'
        },
        { status: 400 }
      );
    }

    // Log successful validation
    console.log('✅ All required fields validated successfully');
    console.log('📋 Processing request:', {
      book_title: requestData.book_title,
      class_level: requestData.class_level,
      school_type: requestData.school_type,
      subject: requestData.subject,
      chapter: `${requestData.chapter_number}: ${requestData.chapter_name}`,
      pdf_size: pdfFile ? `${Math.round(pdfFile.size / 1024 / 1024 * 100) / 100}MB` : 'No file'
    });

    // SOLUTION: Use direct FormData pass-through with file buffer conversion
    console.log('🔧 Creating backend FormData using buffer conversion...');
    
    const backendFormData = new FormData();
    
    // Add all text fields
    backendFormData.append('book_title', requestData.book_title);
    backendFormData.append('class_level', requestData.class_level);
    backendFormData.append('school_type', requestData.school_type);
    backendFormData.append('subject', requestData.subject);
    backendFormData.append('stream', requestData.stream || '');
    backendFormData.append('state', requestData.state);
    backendFormData.append('school_name', requestData.school_name);
    backendFormData.append('chapter_number', requestData.chapter_number);
    backendFormData.append('chapter_name', requestData.chapter_name);
    
    // Handle PDF file using buffer conversion to avoid "source.on" error
    if (pdfFile) {
      try {
        console.log('📦 Converting PDF file to buffer for compatibility...');
        const buffer = await pdfFile.arrayBuffer();
        const blob = new Blob([buffer], { 
          type: pdfFile.type || 'application/pdf' 
        });
        backendFormData.append('pdf_file', blob, pdfFile.name);
        console.log('✅ PDF file successfully converted and appended');
      } catch (fileError) {
        console.error('❌ Error converting PDF file:', fileError);
        return NextResponse.json(
          { 
            error: 'Failed to process PDF file',
            details: 'The uploaded file could not be processed. Please try again with a different file.'
          },
          { status: 500 }
        );
      }
    }

    // Log FormData contents for debugging
    console.log('📦 Backend FormData contents:');
    for (const [key, value] of backendFormData.entries()) {
      const valueInfo = value instanceof File || value instanceof Blob 
        ? `(${value.constructor.name}: ${value.size} bytes, type: ${value.type})`
        : value;
      console.log(`  ${key}: ${valueInfo}`);
    }

    // Backend connectivity verification
    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';
    console.log('🎯 Backend configuration:');
    console.log(`  BACKEND_URL env var: ${process.env.BACKEND_URL || 'NOT SET (using default)'}`);
    console.log(`  Target URL: ${BACKEND_URL}/process-book`);
    
    // Call backend with comprehensive timeout handling
    console.log('🚀 Making request to backend...');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('⏰ Request timed out after 15 minutes');
      controller.abort();
    }, 900000); // 15 minute timeout (Vercel maximum)
    
    // Build clean headers object without undefined values
    const headers: Record<string, string> = {};
    if (process.env.BACKEND_API_KEY) {
      headers['Authorization'] = `Bearer ${process.env.BACKEND_API_KEY}`;
    }
    
    let backendResponse;
    try {
      backendResponse = await fetch(`${BACKEND_URL}/process-book`, {
        method: 'POST',
        body: backendFormData,
        headers: headers, // Clean headers without keep-alive conflicts
        signal: controller.signal // AbortController handles 15-minute timeout
      });
      
      console.log(`📡 Backend responded with status: ${backendResponse.status}`);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error('❌ Failed to reach backend:', fetchError);
      return NextResponse.json(
        { 
          error: 'Backend connection failed',
          details: `Could not connect to backend server at ${BACKEND_URL}. Please ensure the backend is running.`
        },
        { status: 503 }
      );
    }
    
    clearTimeout(timeoutId);

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error(`❌ Backend error [${backendResponse.status}]:`, errorText);
      
      // Try to parse as JSON for better error details
      let errorDetails = errorText;
      try {
        const errorJson = JSON.parse(errorText);
        errorDetails = errorJson.detail || errorJson.message || errorText;
      } catch (e) {
        // If not JSON, use raw text
      }
      
      return NextResponse.json(
        { 
          error: `Backend processing failed (${backendResponse.status})`,
          details: errorDetails
        },
        { status: backendResponse.status }
      );
    }

    const result = await backendResponse.json();
    console.log(`✅ Backend processing successful for: ${requestData.book_title} - Chapter ${requestData.chapter_number}`);

    return NextResponse.json({
      success: true,
      message: 'Chapter processing completed successfully',
      data: {
        book_title: requestData.book_title,
        subject: requestData.subject,
        class_level: requestData.class_level,
        school_type: requestData.school_type,
        stream: requestData.stream,
        state: requestData.state,
        school_name: requestData.school_name,
        chapter_number: requestData.chapter_number,
        chapter_name: requestData.chapter_name,
        backendResult: result
      }
    });

  } catch (error) {
    console.error('❌ Process book API error:', error);
    
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { 
          error: 'Processing timed out', 
          details: 'The PDF processing took longer than expected (15 minutes). Please try again with a smaller file or contact support.'
        },
        { status: 408 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to process chapter', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}