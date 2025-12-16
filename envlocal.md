# Recommended for most uses
DATABASE_URL=postgresql://neondb_owner:npg_6rWBqDybm9Rv@ep-purple-silence-a4zi085p-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require

# For uses requiring a connection without pgbouncer
DATABASE_URL_UNPOOLED=postgresql://neondb_owner:npg_6rWBqDybm9Rv@ep-purple-silence-a4zi085p.us-east-1.aws.neon.tech/neondb?sslmode=require

# Parameters for constructing your own connection string
PGHOST=ep-purple-silence-a4zi085p-pooler.us-east-1.aws.neon.tech
PGHOST_UNPOOLED=ep-purple-silence-a4zi085p.us-east-1.aws.neon.tech
PGUSER=neondb_owner
PGDATABASE=neondb
PGPASSWORD=npg_6rWBqDybm9Rv

# Parameters for Vercel Postgres Templates
POSTGRES_URL=postgresql://neondb_owner:npg_6rWBqDybm9Rv@ep-purple-silence-a4zi085p-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
POSTGRES_URL_NON_POOLING=postgresql://neondb_owner:npg_6rWBqDybm9Rv@ep-purple-silence-a4zi085p.us-east-1.aws.neon.tech/neondb?sslmode=require
POSTGRES_USER=neondb_owner
POSTGRES_HOST=ep-purple-silence-a4zi085p-pooler.us-east-1.aws.neon.tech
POSTGRES_PASSWORD=npg_6rWBqDybm9Rv
POSTGRES_DATABASE=neondb
POSTGRES_URL_NO_SSL=postgresql://neondb_owner:npg_6rWBqDybm9Rv@ep-purple-silence-a4zi085p-pooler.us-east-1.aws.neon.tech/neondb
POSTGRES_PRISMA_URL=postgresql://neondb_owner:npg_6rWBqDybm9Rv@ep-purple-silence-a4zi085p-pooler.us-east-1.aws.neon.tech/neondb?connect_timeout=15&sslmode=require

# Neon Auth environment variables for Next.js
NEXT_PUBLIC_STACK_PROJECT_ID=****************************
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=****************************************
STACK_SECRET_SERVER_KEY=***********************

BLOB_READ_WRITE_TOKEN=vercel_blob_rw_onRovwlwOVzsytDF_DlWaNhQlr0UAcT1etFBgvhyVK6mxLt
