import type { CodegenConfig } from '@graphql-codegen/cli'
import { env } from '@web/env'

const config: CodegenConfig = {
   schema: '../server/internal/graph/schema.graphqls',
   documents: ['src/lib/graphql/*.ts'],
   generates: {
      './src/lib/graphql/generated/': {
         preset: 'client',
      },
   }
}

export default config