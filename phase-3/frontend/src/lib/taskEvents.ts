// lib/taskEvents.ts
// Simple event emitter for task updates

type TaskEventCallback = () => void;

class TaskEventEmitter {
  private listeners: TaskEventCallback[] = [];

  subscribe(callback: TaskEventCallback) {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  emit() {
    this.listeners.forEach(callback => callback());
  }
}

export const taskEvents = new TaskEventEmitter();

// Helper function to trigger task refresh
export function triggerTaskRefresh() {
  console.log('🔄 Triggering task refresh...');
  taskEvents.emit();
}