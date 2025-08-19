<template>
  <div v-if="visible" class="notification" :class="type">
    <p>{{ message }}</p>
    <button @click="visible = false" class="close-btn">×</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'AppNotification',
  props: {
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'info',
      validator: (value: string) => ['info', 'success', 'warning', 'error'].includes(value)
    },
    duration: {
      type: Number,
      default: 5000 // 5 seconds
    }
  },
  setup(props) {
    const visible = ref(true);
    
    // Auto-hide after duration
    if (props.duration > 0) {
      const timer = setTimeout(() => {
        visible.value = false;
      }, props.duration);
      
      return {
        visible,
        onBeforeUnmount: () => clearTimeout(timer)
      };
    }
    
    return { visible };
  }
});
</script>

<style scoped>
.notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 4px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 250px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
}

.notification.info {
  background-color: #3498db;
}

.notification.success {
  background-color: #2ecc71;
}

.notification.warning {
  background-color: #f39c12;
  color: #2c3e50;
}

.notification.error {
  background-color: #e74c3c;
}

.close-btn {
  background: none;
  border: none;
  color: inherit;
  font-size: 20px;
  cursor: pointer;
  padding: 0 0 0 15px;
  margin: 0;
  line-height: 1;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
