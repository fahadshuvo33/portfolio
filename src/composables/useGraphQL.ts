import { ref } from 'vue';
import { execute } from '@/api/executor';

export function useGraphQL() {
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const data = ref<any>(null);

  const executeQuery = async (query: string, variables: Record<string, any> = {}) => {
    loading.value = true;
    error.value = null;
    data.value = null;

    try {
      const result = await execute(query, variables);
      
      if (result.errors) {
        throw new Error(result.errors.map(e => e.message).join('\n'));
      }
      
      data.value = result.data;
      return result.data;
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('An unknown error occurred');
      console.error('GraphQL error:', error.value);
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    data,
    executeQuery,
  };
}
