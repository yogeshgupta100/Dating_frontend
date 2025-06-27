// Request batching utility to reduce API calls
class RequestBatcher {
  private batches: Map<string, { requests: Array<{ resolve: Function; reject: Function; data: any }>; timer: NodeJS.Timeout | null }> = new Map();
  private batchDelay = 100; // 100ms delay to batch requests

  async batchRequest<T>(
    key: string,
    requestFn: (data: any[]) => Promise<T[]>,
    data: any
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const batch = this.batches.get(key);
      
      if (batch) {
        // Add to existing batch
        batch.requests.push({ resolve, reject, data });
      } else {
        // Create new batch
        const newBatch = {
          requests: [{ resolve, reject, data }],
          timer: null as NodeJS.Timeout | null
        };
        
        newBatch.timer = setTimeout(() => {
          this.executeBatch(key, requestFn);
        }, this.batchDelay);
        
        this.batches.set(key, newBatch);
      }
    });
  }

  private async executeBatch<T>(
    key: string,
    requestFn: (data: any[]) => Promise<T[]>
  ): Promise<void> {
    const batch = this.batches.get(key);
    if (!batch) return;

    this.batches.delete(key);
    
    try {
      const allData = batch.requests.map(req => req.data);
      const results = await requestFn(allData);
      
      // Resolve each request with its corresponding result
      batch.requests.forEach((request, index) => {
        request.resolve(results[index]);
      });
    } catch (error) {
      // Reject all requests in the batch
      batch.requests.forEach(request => {
        request.reject(error);
      });
    }
  }

  // Clear all pending batches
  clearBatches(): void {
    this.batches.forEach(batch => {
      if (batch.timer) {
        clearTimeout(batch.timer);
      }
    });
    this.batches.clear();
  }

  // Get batch statistics
  getBatchStats(): { pendingBatches: number; totalPendingRequests: number } {
    let totalRequests = 0;
    this.batches.forEach(batch => {
      totalRequests += batch.requests.length;
    });
    
    return {
      pendingBatches: this.batches.size,
      totalPendingRequests: totalRequests
    };
  }
}

// Global request batcher instance
export const requestBatcher = new RequestBatcher();

// Debounce utility for search inputs
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Throttle utility for scroll events
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}; 