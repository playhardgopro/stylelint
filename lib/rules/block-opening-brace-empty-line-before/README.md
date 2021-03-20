# block-opening-brace-empty-line-before

Require or disallow an empty line before the opening brace of blocks.

<!-- prettier-ignore -->
```css
a
/* ←  This line*/
{
  color: pink;
}
```

The [`fix` option](../../../docs/user-guide/usage/options.md#fix) can automatically fix all of the problems reported by this rule.

## Options

`string`: `"always-multi-line"|"never"`

### `always-multi-line`

The following patterns are considered violations:

<!-- prettier-ignore -->
```css
a {
  color: pink;
}
```

The following patterns are _not_ considered violations:

<!-- prettier-ignore -->
```css
a
{
  color: pink;
}
```

<!-- prettier-ignore -->
```css
a

{
  color: pink;
}
```

### `never`

The following patterns are considered violations:

<!-- prettier-ignore -->
```css
a

{
  color: pink;
}
```

The following patterns are _not_ considered violations:

<!-- prettier-ignore -->
```css
a {
  color: pink;
}
```

<!-- prettier-ignore -->
```css
a
{ color: pink; }
```

<!-- prettier-ignore -->
```css
a { color: pink; }
```
