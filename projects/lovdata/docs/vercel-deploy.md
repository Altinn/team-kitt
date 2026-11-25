# Vercel MCP Deployment

This repository can run on Vercel as a Streamable HTTP MCP server at
`/api/mcp`.

## Deployment Shape

The full local SQLite database includes Norsk Lovtidend provenance and is too
large for Vercel Hobby:

- full `data/database.db`: about 849 MB
- Vercel Node function bundle limit: 250 MB
- Vercel function writable `/tmp` scratch space: 500 MB

For Vercel testing, use the current-law database:

- current laws and central regulations included
- Lovtidend provenance omitted
- generated file: `data/database.vercel-current.db`
- expected size: about 132 MB

The Vercel function downloads that database from Vercel Blob into `/tmp` on the
first cold start.

Public Blob stores work with only `DIGDIR_NORWEGIAN_LAW_DB_URL`. Private Blob
stores also work, but the deployed project must have `BLOB_READ_WRITE_TOKEN`
from the same Blob store. Vercel adds this automatically when the store is
connected to the project.

## Build The Vercel Database

```bash
npm run build:db:vercel-current
shasum -a 256 data/database.vercel-current.db
```

## Upload The Database To Vercel Blob

Create or connect a Vercel Blob store, then upload.

For a public Blob store:

```bash
npx vercel blob put data/database.vercel-current.db \
  --pathname database.vercel-current.db \
  --allow-overwrite
```

For a private Blob store:

```bash
npx vercel blob put data/database.vercel-current.db \
  --pathname database.vercel-current.db \
  --access private \
  --allow-overwrite
```

Save the returned Blob URL.

Set production environment variables:

```bash
npx vercel env add DIGDIR_NORWEGIAN_LAW_DB_URL production
npx vercel env add DIGDIR_NORWEGIAN_LAW_DB_SHA256 production
```

Use the Blob URL for `DIGDIR_NORWEGIAN_LAW_DB_URL` and the `shasum` value for
`DIGDIR_NORWEGIAN_LAW_DB_SHA256`.

If the Blob URL looks like
`https://<store-id>.private.blob.vercel-storage.com/database.vercel-current.db`,
confirm that `BLOB_READ_WRITE_TOKEN` exists in the same production environment.
Without that token, the deployed function will fail with `403 Forbidden` during
the database download.

`DIGDIR_NORWEGIAN_LAW_DB_SHA256` is required whenever the deployed server
downloads the SQLite database outside local development. This prevents the MCP
server from serving a remote database whose contents were not verified.

## Deploy

```bash
npx vercel deploy --prod
```

After deployment:

```bash
curl https://<your-project>.vercel.app/api/health
```

Use this MCP endpoint in ChatGPT or another Streamable HTTP client:

```text
https://<your-project>.vercel.app/api/mcp
```

## Local Vercel Test

```bash
npm run build:db:vercel-current
npm run dev:vercel
```

Then connect an MCP inspector to:

```text
http://localhost:3000/api/mcp
```
