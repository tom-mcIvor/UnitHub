import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Try to fetch from tenants table
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .limit(5)

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      tenantCount: data?.length || 0,
      tenants: data
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: String(error)
    }, { status: 500 })
  }
}
