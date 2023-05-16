import { test, expect } from 'bun:test'
import { optimize_schema } from './lib'

test('optimize_schema', () => {
  expect(
    optimize_schema(`
  CREATE TABLE public.test (
    "id" int NOT NULL,
    "varchar" varchar(255) NOT NULL,
    "text" text NOT NULL,
    "boolean" boolean NOT NULL,
    "nullable_boolean" boolean,
    "date" date NOT NULL,
    "timestamp" timestamp NOT NULL,
    "timestamptz" timestamptz NOT NULL,
    "nullable_timestamptz" timestamptz,
    "nullable_timestamptz_with_default" timestamptz DEFAULT now(),
    "time" time NOT NULL,
    "timetz" timetz NOT NULL,
    "interval" interval NOT NULL,
    "numeric" numeric NOT NULL,
    "decimal" decimal NOT NULL,
    "real" real NOT NULL,
    "double" double precision NOT NULL,
    "money" money NOT NULL,
    "smallint" smallint NOT NULL,
    "integer" integer NOT NULL,
    "nullable_integer" integer,
    "bigint" bigint NOT NULL,
    "serial" serial NOT NULL,
    "bigserial" bigserial NOT NULL,
    "bit" bit NOT NULL,
    "bit_varying" bit varying NOT NULL,
    "uuid" uuid NOT NULL,
    "xml" xml NOT NULL,
    "json" json NOT NULL,
    "jsonb" jsonb NOT NULL,
    "point" point NOT NULL,
    "line" line NOT NULL,
    "lseg" lseg NOT NULL,
    "box" box NOT NULL,
    "path" path NOT NULL,
    "polygon" polygon NOT NULL,
    "circle" circle NOT NULL,
    "cidr" cidr NOT NULL,
    "inet" inet NOT NULL
    );
  `),
  ).toMatchSnapshot()
})
