declare function onEvent<T extends EventName>(eventName: T, callback: (event: EventType<T>) => void): void;
