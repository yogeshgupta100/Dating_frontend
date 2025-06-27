// Performance monitoring utility
class PerformanceMonitor {
  private metrics: Map<string, { count: number; totalTime: number; avgTime: number; minTime: number; maxTime: number }> = new Map();

  startTimer(operation: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      this.recordMetric(operation, duration);
    };
  }

  private recordMetric(operation: string, duration: number): void {
    const existing = this.metrics.get(operation) || {
      count: 0,
      totalTime: 0,
      avgTime: 0,
      minTime: Infinity,
      maxTime: 0
    };

    existing.count++;
    existing.totalTime += duration;
    existing.avgTime = existing.totalTime / existing.count;
    existing.minTime = Math.min(existing.minTime, duration);
    existing.maxTime = Math.max(existing.maxTime, duration);

    this.metrics.set(operation, existing);
  }

  getMetrics(): Record<string, any> {
    const result: Record<string, any> = {};
    
    this.metrics.forEach((metric, operation) => {
      result[operation] = {
        count: metric.count,
        avgTime: Math.round(metric.avgTime * 100) / 100,
        minTime: Math.round(metric.minTime * 100) / 100,
        maxTime: Math.round(metric.maxTime * 100) / 100,
        totalTime: Math.round(metric.totalTime * 100) / 100
      };
    });
    
    return result;
  }

  logMetrics(): void {
    const metrics = this.getMetrics();
    console.group('🚀 API Performance Metrics');
    
    Object.entries(metrics).forEach(([operation, metric]) => {
      console.log(`${operation}:`, {
        calls: metric.count,
        avg: `${metric.avgTime}ms`,
        min: `${metric.minTime}ms`,
        max: `${metric.maxTime}ms`,
        total: `${metric.totalTime}ms`
      });
    });
    
    console.groupEnd();
  }

  clearMetrics(): void {
    this.metrics.clear();
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Higher-order function to wrap API calls with performance monitoring
export const withPerformanceMonitoring = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  operationName: string
) => {
  return async (...args: T): Promise<R> => {
    const endTimer = performanceMonitor.startTimer(operationName);
    
    try {
      const result = await fn(...args);
      endTimer();
      return result;
    } catch (error) {
      endTimer();
      throw error;
    }
  };
};

// Utility to log performance metrics (useful for debugging)
export const logPerformanceMetrics = (): void => {
  performanceMonitor.logMetrics();
};

// Utility to get performance metrics
export const getPerformanceMetrics = (): Record<string, any> => {
  return performanceMonitor.getMetrics();
}; 