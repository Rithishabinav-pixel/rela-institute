// Node's native ESM resolver requires an exact extension for package subpath
// imports (e.g. `next/cache`) when the package has no "exports" map — unlike
// Next's own bundler, which aliases these specifiers internally. This hook
// lets prisma/seed.js run standalone via plain `node` by retrying a failed
// `next/<subpath>` resolution with `.js` appended, scoped narrowly so it
// never touches resolution for any other package.
export async function resolve(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context)
  } catch (error) {
    if (/^next\/[^./]+$/.test(specifier)) {
      return nextResolve(`${specifier}.js`, context)
    }
    throw error
  }
}
