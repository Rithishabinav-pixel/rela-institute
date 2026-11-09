# Rela Institute -- Deployment Guide

This guide explains how to deploy code changes from your local VS Code
project to the Rela Institute production server.

## 1. Make and push changes locally

After making changes in VS Code, commit and push them to the `main`
branch:

``` bash
git add .
git commit -m "Update website"
git push origin main
```

This uploads your latest code to GitHub.

## 2. Connect to the server and open the application directory

SSH into the server, then run:

``` bash
cd /var/www/relainstitute.designagency.in/public
```

**Important:** This is the application root. Do not run deployment
commands from the parent directory.

## 3. Deploy normal code changes

For changes such as:

-   Adding or updating pages
-   Updating React components
-   Changing CSS or frontend content
-   Adding API routes without changing the database structure
-   Updating application logic without changing the Prisma schema

Run:

``` bash
git pull origin main
npm run build
pm2 restart rela-frontend
```

If `package.json` or `package-lock.json` changed, install the updated
dependencies before building:

``` bash
npm install
```

## 4. Deploy database schema changes

Use this process when you add or modify Prisma models, tables, columns,
or relations.

### On your local machine

1.  Update `prisma/schema.prisma`.
2.  Create a migration:

``` bash
npx prisma migrate dev --name add_new_table
```

Replace `add_new_table` with a short description of the change.

3.  Commit and push the schema and generated migration files:

``` bash
git add .
git commit -m "Add database table"
git push origin main
```

### On the production server

From the application root, run:

``` bash
git pull origin main
npm install
npx prisma migrate deploy
npm run build
pm2 restart rela-frontend
```

`prisma migrate deploy` applies pending migration files to the
production database. It does not reset the database.

**Important:** Do not run `prisma migrate dev` on the production server.
Create migrations locally and apply them on the server using
`prisma migrate deploy`.

## 5. Handle database data changes carefully

A schema migration and a data change are different things.

  -----------------------------------------------------------------------
  Change                              Production action
  ----------------------------------- -----------------------------------
  Add a page or component             Pull, build, restart

  Update CSS or frontend content      Pull, build, restart

  Add an API route                    Pull, build, restart

  Add a Prisma table or column        Pull, apply migrations, build,
                                      restart

  Update existing database records    Use the admin panel, API, or a
                                      controlled data-import script

  Add initial/seed data               Run an appropriate, reviewed seed
                                      script

  Replace the entire production       Back up production first, then
  database                            intentionally restore the
                                      replacement database
  -----------------------------------------------------------------------

Do not copy or restore your entire local database over production for
every deployment. Doing so can overwrite or remove data that has been
entered on the live site.

If you intentionally need to replace the production database with a
local copy:

1.  Confirm that replacing production data is intended.
2.  Take a backup of the current production database.
3.  Verify the local backup file.
4.  Restore it using a planned database procedure.
5.  Verify the application and data afterwards.

Never perform a database replacement without a verified backup.

## 6. Check the deployment

After restarting the application, check PM2:

``` bash
pm2 status
pm2 logs rela-frontend --lines 50
```

Check that the Next.js application responds locally on the server:

``` bash
curl -I http://127.0.0.1:3010
```

The application should return a successful HTTP response.

## 7. Quick command reference

### Normal code-only deployment

Run on the server:

``` bash
cd /var/www/relainstitute.designagency.in/public

git pull origin main
npm run build
pm2 restart rela-frontend
```

### Deployment with Prisma schema changes

First create and commit the migration locally. Then run on the server:

``` bash
cd /var/www/relainstitute.designagency.in/public

git pull origin main
npm install
npx prisma migrate deploy
npm run build
pm2 restart rela-frontend
```

Run `npm install` when dependencies or the lockfile have changed. It is
also acceptable to run it during a schema-change deployment.

## 8. Important note about the current migration issue

The production database previously reported a failed migration named:

`20261022120000_add_enquiries`

Prisma also reported `P3009`, which means a failed migration is recorded
in the database migration history.

Before running `npx prisma migrate deploy` again, safely verify and
reconcile that migration. Do not delete tables, reset the database, or
mark the migration as applied until you have verified that all tables,
columns, and constraints created by that migration are present and
correct.

## 9. Recommended deployment order

Keep this order for deployments:

1.  Make changes locally.
2.  Create a Prisma migration locally if the database schema changed.
3.  Commit and push the code and migration files to GitHub.
4.  Pull the latest code on the server.
5.  Install dependencies if required.
6.  Apply pending Prisma migrations if the schema changed.
7.  Build the Next.js application.
8.  Restart the PM2 process.
9.  Check PM2 logs and test the website.

**Remember:** Code deployment does not automatically transfer local
database data to the server. Database schema migrations, data imports,
and full database backups/restores are separate operations.