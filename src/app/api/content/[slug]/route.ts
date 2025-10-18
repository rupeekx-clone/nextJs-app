import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import StaticContent from '@/models/StaticContent';

export async function GET(req: NextRequest, context: { params: { slug: string } }) {
  try {
    const slug = context.params.slug;

    if (!slug) {
      return NextResponse.json({
        error: 'Content slug is required'
      }, { status: 400 });
    }

    await connectToDatabase();

    // Find the static content by slug
    const content = await StaticContent.findOne({
      slug,
      is_published: true
    });

    if (!content) {
      return NextResponse.json({
        error: 'Content not found'
      }, { status: 404 });
    }

    const contentData = content.toJSON();

    return NextResponse.json({
      content_id: contentData.content_id,
      slug: contentData.slug,
      title: contentData.title,
      content_body: contentData.content_body,
      meta_description: contentData.meta_description,
      last_updated_by: contentData.last_updated_by,
      created_at: contentData.created_at,
      updated_at: contentData.updated_at
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json({
      error: 'An unexpected error occurred'
    }, { status: 500 });
  }
}
