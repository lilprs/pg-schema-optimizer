function get_type_alignment(type) {
  const array_regex = /\[\]$/
  if (array_regex.test(type)) {
    return -1
  }
  if (
    [
      'float8',
      'double precision',
      'bigint',
      'bigserial',
      'int8',
      'serial8',
      'bigint',
      'bigserial',
      'money',
      'macaddr8',
      'timestamp',
      'timestamptz',
      'timestamp with time zone',
      'timestamp without time zone',
      'circle',
      'line',
      'lseg',
      'box',
      'interval',
      'uuid',
      'point',
      'path',
      'polygon',
      'time',
      'timetz',
    ].includes(type)
  ) {
    return 8
  }
  if (
    [
      'int',
      'int4',
      'serial4',
      'integer',
      'serial',
      'float4',
      'real',
      'date',
      'time',
      'cidr',
      'inet',
      'macaddr',
    ].includes(type)
  ) {
    return 4
  }
  if (
    ['int2', 'serial2', 'smallint', 'smallserial'].includes(
      type,
    )
  ) {
    return 2
  }
  if (
    [
      'bool',
      'boolean',
      'char',
      'character',
      'bit',
    ].includes(type)
  ) {
    return 1
  }
  return -1
}

function get_data_type_from_line(line) {
  const tokens = line.trim().split(' ').slice(1)
  const data_type_tokens = []
  for (const token of tokens) {
    if (
      [
        'compression',
        'collate',
        'constraint',
        'not',
        'null',
        'check',
        'default',
        'generated',
        'unique',
        'primary',
        'references',
      ].includes(token.toLowerCase())
    ) {
      break
    }
    data_type_tokens.push(token.replace(/,$/, ''))
  }
  return data_type_tokens.join(' ')
}

export function optimize_schema(unoptimized) {
  let optimized = ''
  const lines = unoptimized.split('\n')

  let inside_table = false
  let columns = []
  for (const line of lines) {
    const normalized_line = line.toLowerCase().trim()
    if (normalized_line.startsWith('create table')) {
      inside_table = true
      columns = []
      optimized += line + '\n'
    } else if (inside_table && normalized_line === ');') {
      inside_table = false
      columns.sort((a, b) => {
        for (let i = 0; i <= 4; i += 1) {
          if (a.sort[i] < b.sort[i]) {
            return -1
          }
          if (a.sort[i] > b.sort[i]) {
            return 1
          }
        }
        return 0
      })
      optimized += columns.map((c) => c.sql).join(',\n')
      optimized += '\n' + line + '\n'
    } else if (inside_table) {
      const args = normalized_line.split(' ')
      const name = args[0]
      const data_type = get_data_type_from_line(line)
      const alignment = get_type_alignment(data_type)
      const primary_key =
        normalized_line.includes('primary key')
      const nullable = !normalized_line.includes('not null')
      const has_default = args[2] === 'default'
      columns.push({
        sql: line.replace(/,$/, ''),
        sort: [
          -alignment, // Sort alignment descending.
          primary_key ? 0 : 1, // Sort PRIMARY KEY first.
          nullable ? 1 : 0, // Sort NOT NULL first.
          has_default && nullable ? 0 : 1, // Sort DEFAULT first (but only when also nullable).
          name, // Sort name ascending.
        ],
      })
    } else {
      optimized += line + '\n'
    }
  }
  return optimized
}
