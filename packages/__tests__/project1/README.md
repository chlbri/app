# Project1 - @bemedev/app Examples

This project contains examples demonstrating how to use the `@bemedev/app`
state machine library.

## Examples

### 1. Traffic Light Machine

A simple state machine modeling a traffic light with three states:

- `red`: Initial state
- `yellow`: Transitions from red on `NEXT` event
- `green`: Transitions from yellow on `NEXT` event

The machine cycles through the traffic light sequence.

### 2. Toggle Machine

A basic toggle switch with two states:

- `off`: Initial state
- `on`: Transitions on `TOGGLE` event

Useful for simple boolean states.

### 3. Counter Machine

A counter with three states:

- `normal`: Initial state for counting operations
- `max_reached`: State when counter reaches maximum
- `min_reached`: State when counter reaches minimum

Demonstrates state machines with context and conditional transitions.

## Running the Examples

```bash
# Install dependencies (from root workspace)
pnpm install

# Run the examples
pnpm -C examples/project1 dev

# Run tests
pnpm -C examples/project1 test
```

## Key Concepts Demonstrated

- **Machine Definition**: Using `createMachine()` to define state machines
- **States**: Defining multiple states in a machine
- **Transitions**: Setting up event-driven state transitions
- **Interpreter**: Using `interpret()` to create service instances and send
  events
- **Context**: Managing machine context and state data

## Further Reading

For more information about the `@bemedev/app` library, check the main
README.md in the root directory.
