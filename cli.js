#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises'
import { parseArgs } from 'node:util'
import { optimize_schema } from './lib.js'

const parsed_args = parseArgs({
  allowPositionals: true,
  options: {
    'output-file': {
      type: 'string',
      short: 'o',
    },
  },
})

const input_file = parsed_args.positionals[0] ?? null
const output_file =
  parsed_args.values['output-file'] ?? null

if (!input_file) {
  process.stderr.write('No input file specified.\n')
  process.exit(1)
}

const unoptimized = await readFile(input_file, {
  encoding: 'utf-8',
})
const optimized = optimize_schema(unoptimized)

if (output_file) {
  await writeFile(output_file, optimized, {
    encoding: 'utf-8',
  })
} else {
  process.stdout.write(optimized)
}
