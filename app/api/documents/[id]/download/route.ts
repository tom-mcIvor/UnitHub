import { NextResponse } from "next/server"
import { getDocument } from "@/app/actions/documents"
import { createAdminClient } from "@/lib/supabase/admin"

const STORAGE_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ?? "UnitHubDocuments"

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const { id } = params

  if (!id) {
    return NextResponse.json({ error: "Missing document id" }, { status: 400 })
  }

  const { data: document, error } = await getDocument(id)

  if (error || !document) {
    return NextResponse.json({ error: error ?? "Document not found" }, { status: 404 })
  }

  if (!document.storagePath) {
    return NextResponse.json({ error: "Document is missing storage path" }, { status: 404 })
  }

  try {
    const adminClient = createAdminClient()
    const { data, error: downloadError } = await adminClient.storage
      .from(STORAGE_BUCKET)
      .download(document.storagePath)

    if (downloadError || !data) {
      return NextResponse.json(
        { error: downloadError?.message ?? "Unable to download document" },
        { status: 500 },
      )
    }

    let mimeType = "application/octet-stream"
    let buffer: Buffer

    if (typeof (data as Blob).type === "string") {
      mimeType = (data as Blob).type || mimeType
    }

    if (typeof (data as Blob).arrayBuffer === "function") {
      const arrayBuffer = await (data as Blob).arrayBuffer()
      buffer = Buffer.from(arrayBuffer)
    } else {
      buffer = Buffer.from(data as ArrayBuffer)
    }

    const extension = document.storagePath.includes(".")
      ? document.storagePath.substring(document.storagePath.lastIndexOf(".") + 1)
      : undefined
    const sanitizedTitle = document.title.replace(/[^a-zA-Z0-9\-_. ]/g, "_")
    const filename = extension && !sanitizedTitle.endsWith(`.${extension}`)
      ? `${sanitizedTitle}.${extension}`
      : sanitizedTitle

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
        "Cache-Control": "no-store",
      },
    })
  } catch (downloadException) {
    console.error("Error proxying document download:", downloadException)
    return NextResponse.json({ error: "Unexpected error downloading document" }, { status: 500 })
  }
}
