# @crbroughton/sibyl

## 2.2.1

### Patch Changes

- 63b74c4: update README.md files with correct information

## 2.2.0

### Minor Changes

- 890ee0c: varchar type now supports size key:value
- d87af46: entries are now NOT NULL by default; The nullable option can now only be set to true
- 348db96: add the primary type - this type can be used, which will allow you to omit the nullable, primary and unique key:values
- 0060407: Add libSQL support - Sibyl now supports the libSQL implementation of SQLite

## 2.1.1

- Bump version because of npm

## 2.1.0

### Minor Changes

- e5d74e0: Add Bun support to Sibyl - See README.md for how to install with Bun

### Patch Changes

- 0092e73: fix boolean lookup when using the Select OR query

## 2.0.0

Version 2.0.0 introduces some breaking API changes to how you create tables; Please see the README.md
file for more information. A new type, SibylResponse, is introduced; You can wrap you table type with this
type, to help convert boolean values. Sibyl now also supports more datatypes, including booleans, variable
characters, and blob types. Siyby also now supports OR statements, again, see the README.md file for
more information. You can also now sort on both the
Select function and the All function.

### Major Changes

- efd0f74: Introducing new SibylResponse type - acts as a wrapper to convert types from TS to database types

### Minor Changes

- 1078868: Add support for OR statements to the Select function
- 64eadea: add the ability to sort using the All function

### Patch Changes

- edb15a7: Add new datatypes to Sibyl - bool, real, varchar, text and blob
  V

## 1.1.0

### Minor Changes

- a9690f4: Feature - Implement Delete - You can now delete entries from your embedded database

### Patch Changes

- 380b598: Remove module line from package.json to fix importing Sibyl

## 1.0.0

### Major Changes

- 961ef2b: Breaking change - Rework entire type-system; Sibyl is more type-aware. Removed table naming setup from Sibyl main function, better inference, multiple table support
- 1b3ce20: Breaking change - createTable now uses object-like syntax for creating type-safe tables

### Patch Changes

- d545559: fix type inference for Select and All functions

## 0.1.0

### Minor Changes

- 224c079: Add the create function - Create enables creating a single new entry into the database
