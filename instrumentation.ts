export async function register() {
  if (process.env.NEXT_RUNTIME === 'edge') return

  try {
    const { ensureAdminUser } = await import('./lib/startup')
    await ensureAdminUser()
  } catch (error) {
    console.error('Startup initialization failed:', error)
  }
}
