import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "Nenhum arquivo enviado." }, { status: 400 });
    }

    const safeName = (file.name || `socialcraft-${Date.now()}.webm`).replace(/[^a-zA-Z0-9._-]/g, "-");
    const buffer = await file.arrayBuffer();

    // 1. Vercel Blob (via REST API nativa, sem dependência extra)
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
    if (blobToken) {
      const uploadRes = await fetch(`https://blob.vercel-storage.com/socialcraft/${Date.now()}-${safeName}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${blobToken}`,
          "x-content-type": file.type || "video/webm"
        },
        body: buffer
      });

      if (uploadRes.ok) {
        const blobData = await uploadRes.json();
        return NextResponse.json({
          success: true,
          url: blobData.url,
          provider: "vercel-blob"
        });
      }
    }

    // 2. Supabase Storage (fallback se configurado)
    const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const sbBucket = process.env.SUPABASE_STORAGE_BUCKET || "socialcraft-media";

    if (sbUrl && sbKey) {
      const objectPath = `videos/${Date.now()}-${safeName}`;
      const sbRes = await fetch(`${sbUrl}/storage/v1/object/${sbBucket}/${objectPath}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sbKey}`,
          "Content-Type": file.type || "video/webm",
          "x-upsert": "true"
        },
        body: buffer
      });

      if (sbRes.ok) {
        return NextResponse.json({
          success: true,
          url: `${sbUrl}/storage/v1/object/public/${sbBucket}/${objectPath}`,
          provider: "supabase-storage"
        });
      }
    }

    return NextResponse.json(
      {
        success: false,
        needsStorageConfig: true,
        error: "Nenhum Storage público configurado (BLOB_READ_WRITE_TOKEN ou SUPABASE_SERVICE_ROLE_KEY). Baixe o vídeo para publicar manualmente ou configure o Vercel Blob."
      },
      { status: 422 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Erro no upload da mídia." },
      { status: 500 }
    );
  }
}
