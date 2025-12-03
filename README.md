# dendro-log

A TypeScript library for rendering complex data structures as a tree in the console.

## Installation

```bash
npm install dendro-log
```

## Usage

### Basic Example

```typescript
import { logTree } from 'dendro-log';

const data = {
  users: [
    { name: 'Alice', age: 30 },
    { name: 'Bob', age: 25 }
  ],
  settings: {
    theme: 'dark',
    notifications: true
  }
};

logTree(data);
```

### Using TreeLogger Class

```typescript
import { TreeLogger } from 'dendro-log';

const treeRenderer = new TreeLogger({ showTypes: true });
console.log(treeRenderer.render({ foo: 'bar' }, 'example'));
```

## Options

The library supports various customization options:

| Option             | Type      | Default   | Description                                        |
|--------------------|-----------|-----------|----------------------------------------------------|
| `maxArrayItems`    | `number`  | `20`      | Maximum number of items to display in an array     |
| `maxDepth`         | `number`  | `10`      | Maximum depth of the tree                          |
| `showTypes`        | `boolean` | `false`   | Whether to show the type of the data               |
| `showArrayLength`  | `boolean` | `false`   | Whether to show the length of arrays               |
| `showArrayIndices` | `boolean` | `false`   | Whether to show the index of each item in an array |
| `colorize`         | `boolean` | `true`    | Whether to colorize the output                     |
| `symbols`          | `object`  | See below | Customize the symbols used in the tree             |

### Symbol Customization

```typescript
{
  symbols: {
    branch: '├── ',      // Symbol for a branch
    lastBranch: '└── ',  // Symbol for the last branch
    vertical: '│   ',    // Symbol for vertical line
    space: '    '        // Symbol for space
  }
}
```

## Examples

### Show types

```typescript
logTree(data, { showTypes: true });
```

### Show array indices and length

```typescript
logTree(data, {
  showArrayIndices: true,
  showArrayLength: true
});
```

### Disable colors

```typescript
logTree(data, { colorize: false });
```

### Custom symbols

```typescript
logTree(data, {
  symbols: {
    branch: '⎢ ',
    lastBranch: '⎣ ',
    vertical: '⎢ ',
    space: '  '
  }
});
```

## Development

```bash
# Build the project
npm run build

# Run type checking
npm run lint
```

## License

MIT
