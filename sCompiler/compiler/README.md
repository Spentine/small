# Compiler Langauge

- Must allow for extendability and abstraction
- Human readable

# Specification

- Use the names of the operations to specify them.
- Declare variable names wherever.
- Separate by spaces.

```js
var x
set x "Hello World!"
input x
print x
```

- Declare constants with `const`.
- Create jump points with `flag`.
  `flag` variables are constants set to their index

```js
const x 1
const y "Hello World!"
jump point2

flag point1
print y
jump point3

flag point2
jump point1

flag point3
```

- Create comments with JS syntax. (`//` and `/* */`)
- Numbers and strings are automatically constants
- `set` can be used to set variables to one another

```js
var x
set x "ok" // sets x to ok

var y
set y x
print y
```

- Variables can be declared with a value
  - `var x y` is the same as `var x` `set x y`
