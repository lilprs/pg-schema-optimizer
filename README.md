# Postgres schema optimizer

Reorders columns in an SQL schema dump file so that they take up less space. It is a simpler and less robust alternative to [pg_column_byte_packer](https://github.com/braintree/pg_column_byte_packer).

The input schema should be well-formed, with each column occupying a single line.

Because it doesn't query a real database, columns with custom data types won't be recognized and will be moved to the end of the table.

## CLI usage

```bash
npx pg-schema-optimizer -o optimized.sql unoptimized.sql
```

## Library usage

```js
import { optimize_schema } from 'pg-schema-optimizer'

console.log(
  optimize_schema(
    `create table "moomin" (
      "name" text not null,
      "age" int2 not null,
      "id" int not null primary key,
      "favourite_color" text
    );`,
  ),
)
```
