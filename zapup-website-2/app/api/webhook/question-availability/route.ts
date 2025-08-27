import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';

interface SupabaseWebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  record: {
    id: number;
    class_id: string;
    subject: string;
    chapter: string;
    section: string;
    question_count: number;
    is_available: boolean;
    last_updated: string;
    created_at: string;
  };
  schema: string;
  old_record?: any;
}

async function invalidateRelevantCaches(classId: string, subject: string, chapter: string) {
  try {
    // Invalidate class-level pages
    revalidatePath(`/questions/${classId}`);
    revalidatePath(`/questions/${classId}/${subject}`);
    
    // Invalidate API cache tags
    revalidateTag(`available-subjects-${classId}`);
    revalidateTag(`questions-${classId}-${subject}`);
    revalidateTag(`question-availability-${classId}`);
    
    console.log(`✅ Cache invalidated for Class ${classId} ${subject} ${chapter}`);
  } catch (error) {
    console.error('❌ Cache invalidation error:', error);
    // Don't throw - webhook should still succeed
  }
}

export async function POST(request: NextRequest) {
  try {
    // Log webhook headers for debugging
    console.log('📥 Webhook headers:', Object.fromEntries(request.headers.entries()));
    
    // Parse webhook payload
    const payload: SupabaseWebhookPayload = await request.json();
    
    // Log the complete payload for debugging
    console.log('📋 Webhook payload:', JSON.stringify(payload, null, 2));
    
    // Validate payload structure
    if (!payload || !payload.record) {
      console.error('❌ Invalid payload structure');
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid payload structure' 
      }, { status: 400 });
    }
    
    const { type, table, record } = payload;
    
    // Validate table name
    if (table !== 'question_availability') {
      console.error('❌ Invalid table:', table);
      return NextResponse.json({ 
        success: false, 
        error: `Invalid table: ${table}` 
      }, { status: 400 });
    }
    
    const { class_id, subject, chapter, question_count, is_available } = record;
    
    // Validate required fields
    if (!class_id || !subject) {
      console.error('❌ Missing required fields:', { class_id, subject });
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields: class_id or subject' 
      }, { status: 400 });
    }
    
    // Log successful webhook processing start
    console.log(`🎯 Webhook received: ${type} for Class ${class_id} ${subject} ${chapter} - ${question_count} questions (available: ${is_available})`);
    
    // Only process if questions are available or this is an update with meaningful changes
    if (type === 'INSERT' || (type === 'UPDATE' && is_available)) {
      // Perform cache invalidation
      await invalidateRelevantCaches(class_id, subject, chapter || 'Unknown');
      
      console.log(`🚀 Successfully processed ${type} webhook for Class ${class_id} ${subject}`);
      
      return NextResponse.json({ 
        success: true, 
        message: `Cache invalidated for Class ${class_id} ${subject} ${chapter}`,
        type,
        classId: class_id,
        subject,
        chapter,
        questionCount: question_count,
        isAvailable: is_available,
        timestamp: new Date().toISOString()
      });
    } else {
      console.log(`ℹ️ Skipping cache invalidation for ${type} (available: ${is_available})`);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Webhook received but no cache invalidation needed',
        type,
        classId: class_id,
        subject,
        skipped: true
      });
    }
    
  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    
    // Return detailed error for debugging
    return NextResponse.json({ 
      success: false, 
      error: 'Webhook processing failed',
      details: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Add GET handler for webhook endpoint testing
export async function GET() {
  return NextResponse.json({
    message: 'Question Availability Webhook Endpoint',
    status: 'active',
    description: 'This endpoint receives Supabase webhooks for question_availability table changes',
    expectedMethods: ['POST'],
    timestamp: new Date().toISOString()
  });
}