# Mind Elixir - Open Source Mind Map Core for React & JavaScript

[![npm version](https://img.shields.io/npm/v/mind-elixir)](https://www.npmjs.com/package/mind-elixir)
[![license](https://img.shields.io/npm/l/mind-elixir)](https://github.com/ssshooter/mind-elixir-core/blob/master/LICENSE)
[![bundlephobia](https://badgen.net/bundlephobia/dependency-count/mind-elixir)](https://bundlephobia.com/result?p=mind-elixir)

**Mind Elixir** is an open-source, framework-agnostic JavaScript mind map core library. Lightweight, high-performance, and feature-rich, it allows developers to build interactive mind mapping tools and integrate them smoothly into modern web applications including **React**, Vue, and Vanilla JS.

---

## 🚀 Key Features

### 🎨 User Experience
- **Fluent & Smooth UX**: Intuitive node editing, drag-and-drop, and navigation.
- **Mobile Friendly**: Native support for touch interactions on mobile devices.
- **Keyboard Shortcuts**: Full set of keyboard shortcuts for power users.
- **Multi-node Operations**: Selection and manipulation of multiple nodes concurrently.

### ⚡ Performance & Architecture
- **Lightweight**: Minimal bundle size with zero external runtime dependencies.
- **High Performance**: Optimized rendering engine capable of handling large mind maps seamlessly.
- **Framework Agnostic**: Easily wrapped within React components, Vue instances, or standard JS scripts.
- **Extensible Architecture**: Plugin system and operation guards to extend behavior.

### 🛠️ Core Capabilities
- **Node Editing & Layouts**: Flexible structure supporting root node, topic nodes, sub-nodes, connections, and summaries.
- **Undo / Redo**: Built-in history stack for changes.
- **Node Connections & Summaries**: Connect arbitrary nodes or group children with summary nodes.
- **Export Formats**: Support for exporting data and rendering maps to SVG, PNG, and HTML formats.

---

## 📦 Installation

Install via your preferred package manager:

```bash
# npm
npm install mind-elixir -S

# yarn
yarn add mind-elixir

# pnpm
pnpm add mind-elixir
```

Import the library and its required styles in your project:

```typescript
import MindElixir from 'mind-elixir';
import 'mind-elixir/style.css';
```

---

## ⚛️ React Integration

In React, Mind Elixir directly manages canvas/DOM elements, so it is recommended to bind it to a DOM container using `useRef` within a `useEffect` hook.

### Complete React Component Example

```tsx
import React, { useEffect, useRef } from 'react';
import MindElixir, { MindElixirData, MindElixirInstance } from 'mind-elixir';
import 'mind-elixir/style.css';

interface MindMapProps {
  initialData?: MindElixirData;
  onSelectNode?: (node: any) => void;
}

const defaultData: MindElixirData = {
  nodeData: {
    id: 'root',
    topic: 'Mind Elixir React App',
    children: [
      {
        id: 'c1',
        topic: 'Features',
        children: [
          { id: 'c1_1', topic: 'Lightweight & Fast' },
          { id: 'c1_2', topic: 'Keyboard Shortcuts' },
        ],
      },
      {
        id: 'c2',
        topic: 'Integration',
        children: [
          { id: 'c2_1', topic: 'React Hooks Support' },
          { id: 'c2_2', topic: 'Custom CSS Styling' },
        ],
      },
    ],
  },
};

export const ReactMindMap: React.FC<MindMapProps> = ({
  initialData = defaultData,
  onSelectNode,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const meInstanceRef = useRef<MindElixirInstance | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Instantiate MindElixir
    const me = new MindElixir({
      el: containerRef.current,
      direction: MindElixir.LEFT, // MindElixir.LEFT | MindElixir.RIGHT | MindElixir.SIDE
      draggable: true,
      contextMenu: true,
      toolBar: true,
      nodeMenu: true,
      keypress: true,
    });

    // 2. Initialize with data
    me.init(initialData);
    meInstanceRef.current = me;

    // 3. Register Event Listeners
    if (onSelectNode) {
      me.bus.addListener('selectNode', (node) => {
        onSelectNode(node);
      });
    }

    return () => {
      // Optional cleanup if needed when unmounting
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '600px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    />
  );
};

export default ReactMindMap;
```

---

## 📊 Data Structure

Mind Elixir uses a JSON structure rooted at `nodeData`.

```json
{
  "nodeData": {
    "id": "root",
    "topic": "Central Topic",
    "style": {
      "color": "#333333",
      "background": "#f5f5f5"
    },
    "children": [
      {
        "id": "node_1",
        "topic": "Main Branch 1",
        "direction": 0,
        "children": [
          {
            "id": "node_1_1",
            "topic": "Subtopic A"
          }
        ]
      }
    ]
  },
  "arrows": [],
  "summaries": []
}
```

### Node Object Attributes
| Property | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique identifier for the node |
| `topic` | `string` | Text content of the node |
| `children` | `NodeObj[]` | Array of child nodes |
| `expanded` | `boolean` | Whether sub-branches are expanded |
| `style` | `object` | Inline CSS attributes (`color`, `background`, `fontSize`, etc.) |
| `hyperLink` | `string` | URL attached to the node |
| `icons` | `string[]` | Array of icon strings |
| `tags` | `string[]` | Array of tag text strings |

---

## ⚙️ Configuration & Options

When calling `new MindElixir(options)`, the following configuration options are available:

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `el` | `string \| HTMLElement` | *(Required)* | Container selector or HTML element |
| `direction` | `number` | `MindElixir.SIDE` | Layout direction (`MindElixir.LEFT`, `RIGHT`, or `SIDE`) |
| `draggable` | `boolean` | `true` | Enable drag-and-drop node reordering |
| `editable` | `boolean` | `true` | Allow node topic editing |
| `contextMenu` | `boolean` | `true` | Enable right-click context menu |
| `toolBar` | `boolean` | `true` | Show floating toolbar controls |
| `nodeMenu` | `boolean` | `true` | Show node configuration popup menu |
| `keypress` | `boolean` | `true` | Enable default keyboard shortcuts |
| `locale` | `string` | `'en'` | UI language (`'en'`, `'zh_CN'`, `'ja'`, etc.) |
| `before` | `object` | `{}` | Operation guard callbacks for async hooks |

---

## 🛠️ Instance API Methods

Once instantiated (`const me = new MindElixir(...)`), you can interact with the map programmatically:

### Data Export & Operations
- **`me.getData()`**: Returns the full mind map data object.
- **`me.getDataString()`**: Returns the stringified JSON data object.
- **`me.refresh(data?)`**: Re-renders the map with updated data.
- **`me.init(data)`**: Initializes and renders the mind map.

### Node Manipulation
- **`me.selectNode(el, single)`**: Programmatically select a node element.
- **`me.addChild(parentEl, nodeData)`**: Insert a child node into a target parent.
- **`me.insertSibling(type, targetEl, nodeData)`**: Insert a sibling node (`'before'` or `'after'`).
- **`me.removeNode(el)`**: Remove a target node.
- **`me.beginEdit(el)`**: Enter editing mode for a node.

---

## 🔔 Event Handling (`bus`)

Mind Elixir includes an event bus for monitoring interactions:

```typescript
// Subscribe to an event
me.bus.addListener('selectNode', (nodeObj) => {
  console.log('Selected Node:', nodeObj);
});

me.bus.addListener('expandNode', (nodeObj) => {
  console.log('Expanded Node:', nodeObj);
});
```

### Common Events
- `'selectNode'` / `'selectNodes'`: Node selection changes.
- `'unselectNode'`: Node selection cleared.
- `'expandNode'` / `'collapseNode'`: Node visibility toggled.
- `'operation'`: Emitted on node mutation operations (add, move, edit, delete).

---

## 🛡️ Operation Guards (`before`)

Operation guards allow intercepting user operations for asynchronous checks (e.g. confirming deletion or saving to a database):

```typescript
const me = new MindElixir({
  el: '#map',
  before: {
    async addChild(el, obj) {
      const ok = await confirmAsync('Add child node?');
      return ok; // Return true to proceed, false to abort
    },
    async removeNode(el, obj) {
      return await deleteNodeInBackend(obj.id);
    },
  },
});
```

---

## ⌨️ Useful Keyboard Shortcuts

| Key | Action |
| :--- | :--- |
| `Enter` | Insert sibling node |
| `Tab` | Insert child node |
| `F2` | Edit topic |
| `Delete` / `Backspace` | Delete selected node |
| `Ctrl` / `Cmd` + `Z` | Undo |
| `Ctrl` / `Cmd` + `Y` | Redo |
| `Space` | Center map on root node |

---

## 🔗 Useful Links & Resources

- **NPM Package**: [https://www.npmjs.com/package/mind-elixir](https://www.npmjs.com/package/mind-elixir)
- **GitHub Repository**: [https://github.com/ssshooter/mind-elixir-core](https://github.com/ssshooter/mind-elixir-core)
- **Official Documentation**: [https://docs.mind-elixir.com/](https://docs.mind-elixir.com/)
