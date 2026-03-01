import { defineConfig } from 'tsup'
import { glob } from 'glob'

export default defineConfig({
  entry: {
    'index': 'src/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  treeshake: true,
  sourcemap: true,
  external: ['react', 'react-dom', 'lucide-react', '@zenlm/models'],
  onSuccess: async () => {
    const fs = (await import('fs')).default
    const files = glob.sync('dist/**/*.{js,mjs}', { ignore: ['**/*.d.ts'] })
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8')
      if (content.includes('react') || content.includes('jsx-runtime')) {
        if (!content.startsWith('"use client"') && !content.startsWith("'use client'")) {
          fs.writeFileSync(file, '"use client";\n' + content)
        }
      }
    }
  },
})
