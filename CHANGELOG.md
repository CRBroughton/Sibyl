# @crbroughton/sibyl

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
