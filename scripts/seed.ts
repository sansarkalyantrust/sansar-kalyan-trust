import { seedDatabase } from '../lib/seed'

seedDatabase()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
