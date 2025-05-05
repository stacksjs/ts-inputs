# Cursor Tracking

The Cursor Tracking component provides sophisticated cursor position management for formatted inputs. It maintains the expected cursor position even when the input value is being formatted in real-time.

## Features

- 🎯 Precise cursor positioning
- 🔄 Format-aware tracking
- ⌨️ Selection handling
- 📱 Mobile support
- 🎨 RTL support
- 🚀 Performance optimized
- ♿️ Accessibility support

## Basic Usage

```typescript
import { BaseInput } from 'ts-inputs'

const input = new BaseInput('#formatted-input', {
  general: true,
  generalOptions: {
    blocks: [4, 4, 4, 4],
    delimiter: '-',
    uppercase: true,
  },
  // Cursor tracking is enabled by default
})
```

## Advanced Usage

### Custom Cursor Behavior

```typescript
class FormattedInput {
  private input: BaseInput
  private lastCursorPosition: number

  constructor(selector: string) {
    this.input = new BaseInput(selector, {
      general: true,
      generalOptions: {
        blocks: [3, 3, 4],
        delimiter: '-',
        uppercase: true,
        cursorOptions: {
          // Custom cursor behavior
          maintainPosition: true,
          skipDelimiters: true,
          adjustForFormatting: true,
        }
      },
      onValueChanged: this.handleValueChange.bind(this)
    })

    this.setupCursorTracking()
  }

  private setupCursorTracking() {
    const element = document.querySelector(selector)

    element.addEventListener('keydown', (e) => {
      // Store cursor position before input
      this.lastCursorPosition = element.selectionStart
    })

    element.addEventListener('input', () => {
      // Handle cursor position after formatting
      this.handleCursorPosition()
    })
  }

  private handleCursorPosition() {
    const element = document.querySelector(selector)
    const newPosition = this.calculateCursorPosition(
      this.lastCursorPosition,
      element.value
    )

    // Set cursor position
    element.setSelectionRange(newPosition, newPosition)
  }

  private calculateCursorPosition(lastPos: number, value: string): number {
    // Custom cursor position calculation logic
    // based on formatting rules
    return newPosition
  }

  private handleValueChange(formatted: string) {
    // Handle value change while maintaining cursor
    console.log('Value changed, cursor maintained')
  }

  public destroy() {
    this.input.destroy()
  }
}
```

### With Selection Support

```typescript
const input = new BaseInput('#code-input', {
  general: true,
  generalOptions: {
    blocks: [4, 4],
    delimiter: '-',
    cursorOptions: {
      maintainSelection: true,
      selectOnFocus: true,
    }
  }
})
```

## Configuration Options

```typescript
interface CursorOptions {
  // Position Management
  maintainPosition?: boolean // Keep cursor in logical position
  skipDelimiters?: boolean // Skip over delimiters when typing
  adjustForFormatting?: boolean // Adjust for added/removed chars

  // Selection
  maintainSelection?: boolean // Keep selection when formatting
  selectOnFocus?: boolean // Select all on focus

  // Behavior
  moveToEndOnChange?: boolean // Move to end after change
  preventInvalidPos?: boolean // Prevent cursor in invalid positions
}
```

## Cursor Behavior Examples

| Action | Input | Cursor Behavior |
|--------|-------|----------------|
| Type | 123-4[5]6-789 | Maintains position after 5 |
| Delete | 123-[4]56-789 | Stays after 3 |
| Backspace | 123-45[6]-789 | Moves before 6 |
| Selection | [123]-456-789 | Maintains block selection |

## Event Handling

```typescript
const input = new BaseInput('#formatted-input', {
  general: true,
  generalOptions: {
    cursorOptions: {
      onPositionChange: (pos) => {
        console.log('Cursor at:', pos)
      },
      onSelectionChange: (start, end) => {
        console.log('Selection:', start, end)
      }
    }
  }
})
```

## Best Practices

1. **User Experience**
   - Maintain expected cursor behavior
   - Handle selection naturally
   - Provide visual feedback
   - Support keyboard navigation

2. **Performance**
   - Optimize cursor calculations
   - Minimize DOM operations
   - Cache cursor positions
   - Debounce updates

3. **Compatibility**
   - Support mobile devices
   - Handle RTL text
   - Support screen readers
   - Cross-browser testing

4. **Edge Cases**
   - Handle rapid typing
   - Manage paste events
   - Support IME input
   - Handle deletions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- IE11 (with polyfills)

## TypeScript Support

```typescript
interface CursorPosition {
  index: number
  affinity: 'forward' | 'backward'
}

interface Selection {
  start: number
  end: number
  direction: 'forward' | 'backward' | 'none'
}

interface CursorMetadata {
  position: CursorPosition
  selection?: Selection
  isAtDelimiter: boolean
  blockIndex: number
}
```
