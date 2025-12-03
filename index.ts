type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;

type TreeNode = {
    name: string;
    children?: TreeNode[];
    value?: any;
}

type Options = {
    /**
     * Maximum number of items to display in an array.
     * If there are more items, they will be hidden and replaced with "... and [number] more items".
     *
     * Default: `20`
     */
    maxArrayItems: number;
    /**
     * Maximum depth of the tree.
     * If the tree exceeds this depth, it will be cut off.
     *
     * Default: `10`
     */
    maxDepth: number;
    /**
     * Whether to show the type of the data.
     *
     * Default: `false`
     */
    showTypes: boolean;
    /**
     * Whether to show the length of arrays.
     *
     * Default: `false`
     */
    showArrayLength: boolean;
    /**
     * Whether to show the index of each item in an array.
     *
     * Default: `false`
     */
    showArrayIndices: boolean;
    /**
     * Whether to colorize the output.
     *
     * Default: `true`
     */
    colorize: boolean;
    /**
     * Customize the symbols used in the tree.
     */
    symbols: {
        /**
         * Symbol used to indicate a branch in the tree.
         *
         * Default: `'├── '`
         */
        branch: string;
        /**
         * Symbol used to indicate the last branch in the tree.
         *
         * Default: `'└── '`
         */
        lastBranch: string;
        /**
         * Symbol used to indicate a vertical line between nodes.
         *
         * Default: `'│   '`
         */
        vertical: string;
        /**
         * Symbol used to indicate a space between nodes.
         *
         * Default: `'    '`
         */
        space: string;
    }
}

const defaultOptions: Options = {
    maxArrayItems: 20,
    maxDepth: 10,
    showTypes: false,
    showArrayLength: false,
    showArrayIndices: false,
    colorize: true,
    symbols: {
        branch: '├── ',
        lastBranch: '└── ',
        vertical: '│   ',
        space: '    ',
    }
}


const colors = {
    reset: '\x1b[0m',
    key: '\x1b[36m',      // cyan
    string: '\x1b[32m',   // green
    number: '\x1b[33m',   // yellow
    boolean: '\x1b[35m',  // magenta
    null: '\x1b[90m',     // gray
    type: '\x1b[90m',     // gray
};

/**
 * Creates a tree renderer that can be used to render complex data structures as a tree.
 *
 * @example
 * ```ts
 * const treeRenderer = new TreeLogger({showTypes: true});
 *
 * treeRenderer.render({foo: 'bar'}, 'example');
 * ```
 *
 */
export class TreeLogger {
    private options: Options;

    constructor(options: DeepPartial<Options> = {}) {
        this.options = {
            ...defaultOptions,
            ...options,
            symbols: {
                ...defaultOptions.symbols,
                ...options.symbols,
            },
        };
    }

    render(data: any, name = 'root'): string {
        const tree = this.convertToTreeNode(data, name, 0);
        // Start directly with children if it's the root node
        if (tree.children && name === 'root') {
            let result = '';
            tree.children.forEach((child, index) => {
                const isChildLast = index === tree.children!.length - 1;
                result += this.renderNode(child, '', isChildLast);
            });
            return result;
        }
        return this.renderNode(tree, '', true);
    }

    private getDataType (data: any) {
        return Array.isArray(data) ? 'array' : typeof data
    }

    private colorize(text: string, colorType: keyof typeof colors): string {
        if (!this.options.colorize) return text;
        return colors[colorType] + text + colors.reset;
    }

    private convertToTreeNode(data: any, name: string | null, depth: number): TreeNode {
        if (depth >= this.options.maxDepth) {
            return { name: `${name}: [max depth reached]` };
        }

        const typeSuffix = this.options.showTypes ? ` ${this.colorize(`(${this.getDataType(data)})`, 'type')}` : '';

        if (Array.isArray(data)) {
            const arrayLengthSuffix = this.options.showArrayLength ? ` [${data.length}]` : '';

            const displayItems = data.slice(0, this.options.maxArrayItems);
            const children = displayItems.map((item, index) =>
            this.convertToTreeNode(item, this.options.showArrayIndices ? `[${index}]` : null, depth + 1)
            );

            if (data.length > this.options.maxArrayItems) {
                children.push({
                    name: `... and ${data.length - this.options.maxArrayItems} more items`
                });
            }

            return {
                name: `${this.colorize(name || '', 'key')}${arrayLengthSuffix}${typeSuffix}`,
                children
            };
        }

        if (typeof data === 'object' && data !== null) {
            return {
                name: `${this.colorize(name || '', 'key')}${typeSuffix}`,
                children: Object.entries(data).map(([key, value]) =>
                    this.convertToTreeNode(value, key, depth + 1)
                )
            };
        }

        const namePrefix = name ? `${this.colorize(name, 'key')}: ` : '';
        const dataType = this.getDataType(data);
        let coloredValue = String(data);

        if (dataType === 'string') {
            coloredValue = this.colorize(String(data), 'string');
        } else if (dataType === 'number') {
            coloredValue = this.colorize(String(data), 'number');
        } else if (dataType === 'boolean') {
            coloredValue = this.colorize(String(data), 'boolean');
        } else if (data === null) {
            coloredValue = this.colorize('null', 'null');
        }

        return {
            name: `${namePrefix}${coloredValue}${typeSuffix}`,
            value: data
        };
    }

    private renderNode(node: TreeNode, prefix: string, isLast: boolean): string {
        const connector = isLast ? this.options.symbols.lastBranch : this.options.symbols.branch;
        const childPrefix = prefix + (isLast ? this.options.symbols.space : this.options.symbols.vertical);

        let result = prefix + connector + node.name + '\n';

        if (node.children) {
            node.children.forEach((child, index) => {
                const isChildLast = index === node.children!.length - 1;
                result += this.renderNode(child, childPrefix, isChildLast);
            });
        }

        return result;
    }
}

/**
 * Renders complex data structures as a tree.
 *
 * @example
 * ```ts
 * logTree({foo: 'bar'}, {showTypes: true}, 'example');
 * ```
 *
 */
export const logTree = (data: any, options?: Options, name?: string) => {
    const renderer = new TreeLogger(options);

    console.log(renderer.render(data, name));
}
