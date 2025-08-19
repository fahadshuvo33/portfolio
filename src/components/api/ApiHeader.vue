<template>
  <header class="glassmorphic-header">
    <div class="header-content">
      <!-- Logo Section -->
      <div class="logo-section">
        <div class="logo-container">
          <div class="logo-glow"></div>
          <div class="logo-icon">
            <svg class="icon" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>

        <div class="brand-info">
          <h1 class="brand-title">GraphQL Studio</h1>
          <p class="brand-subtitle">Interactive API Explorer</p>
        </div>
      </div>

      <!-- Controls Section -->
      <div class="controls-section">
        <!-- Connection Status -->
        <div class="connection-status">
          <div class="connection-indicator">
            <div class="pulse-dot"></div>
            <div class="pulse-ring"></div>
          </div>
          <span class="connection-text">Connected</span>
        </div>

        <!-- Theme Toggle -->
        <button @click="$emit('toggle-theme')" class="control-button theme-toggle">
          <div class="button-content">
            <svg
              v-if="currentTheme === 'dark'"
              class="theme-icon"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
            <svg
              v-else-if="currentTheme === 'light'"
              class="theme-icon"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                clip-rule="evenodd"
              />
            </svg>
            <svg
              v-else-if="currentTheme === 'cyberpunk'"
              class="theme-icon"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 2L2 7v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7l-10-5zM12 4.2L20 8v9H4V8l8-3.8z"
              />
              <path d="M8 10h8v2H8zm0 3h8v2H8z" />
            </svg>
            <svg
              v-else-if="currentTheme === 'ocean'"
              class="theme-icon"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M3.5 18.5l9-9s1.5-1.5 3-1.5 3 1.5 3 1.5l4 4-1.5 1.5-4-4s-.5-.5-1.5-.5-1.5.5-1.5.5l-9 9L3.5 18.5z"
              />
              <path d="M9.5 12.5l4-4 1.5 1.5-4 4-1.5-1.5z" />
            </svg>
            <svg
              v-else-if="currentTheme === 'forest'"
              class="theme-icon"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"
              />
            </svg>
            <svg
              v-else-if="currentTheme === 'sunset'"
              class="theme-icon"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"
              />
            </svg>
            <svg
              v-else-if="currentTheme === 'midnight'"
              class="theme-icon"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"
              />
            </svg>
            <svg
              v-else-if="currentTheme === 'aurora'"
              class="theme-icon"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.54 0 3-.35 4.31-.99-.9-.79-1.45-1.95-1.45-3.24 0-2.21 1.79-4 4-4 .34 0 .67.05.98.14C19.31 15.03 19 13.54 19 12c0-3.86-3.14-7-7-7z"
              />
              <circle cx="15.5" cy="9.5" r="1.5" />
              <circle cx="8.5" cy="14.5" r="1.5" />
            </svg>
            <svg
              v-else-if="currentTheme === 'neon'"
              class="theme-icon"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"
              />
              <path
                d="M12 7L9.5 11.5l-4.5.5 3.5 3L7.5 20l4.5-2.5L16.5 20l-1-4.5 3.5-3-4.5-.5L12 7z"
                opacity="0.5"
              />
            </svg>
            <svg
              v-else-if="currentTheme === 'vintage'"
              class="theme-icon"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
              />
            </svg>
            <!-- Default fallback -->
            <svg v-else class="theme-icon" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 716.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
            <span class="theme-label">{{ currentTheme }}</span>
          </div>
          <div class="button-glow"></div>
        </button>

        <!-- Help Button -->
        <button @click="$emit('show-help')" class="control-button help-button">
          <div class="button-content">
            <svg class="help-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span class="help-label">Help</span>
          </div>
          <div class="button-glow help-glow"></div>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
interface Props {
  currentTheme: string
}

const props = withDefaults(defineProps<Props>(), {
  currentTheme: 'dark',
})

const emit = defineEmits(['toggle-theme', 'show-help'])
</script>

<style scoped>
.glassmorphic-header {
  position: relative;
  background: rgba(15, 20, 25, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  margin-bottom: 20px;
  overflow: hidden;
  min-height: 60px;
}

.glassmorphic-header::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.08) 0%,
    rgba(147, 51, 234, 0.04) 50%,
    rgba(6, 182, 212, 0.08) 100%
  );
  pointer-events: none;
}

.header-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  gap: 16px;
  min-height: 60px;
}

/* Logo Section */
.logo-section {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.logo-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-glow {
  position: absolute;
  inset: -3px;
  background: linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6);
  border-radius: 14px;
  filter: blur(8px);
  opacity: 0.5;
  animation: logoGlow 3s ease-in-out infinite alternate;
}

.logo-icon {
  position: relative;
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
}

.logo-icon .icon {
  width: 20px;
  height: 20px;
  color: white;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.brand-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.brand-title {
  font-size: 18px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  margin: 0;
  background: linear-gradient(135deg, #ffffff, #e2e8f0);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
}

.brand-subtitle {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  font-weight: 500;
  line-height: 1.2;
}

/* Controls Section */
.controls-section {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

/* Connection Status */
.connection-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 10px;
  backdrop-filter: blur(10px);
}

.connection-indicator {
  position: relative;
  width: 8px;
  height: 8px;
}

.pulse-dot {
  width: 100%;
  height: 100%;
  background: #10b981;
  border-radius: 50%;
  box-shadow: 0 0 6px rgba(16, 185, 129, 0.8);
}

.pulse-ring {
  position: absolute;
  inset: 0;
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.connection-text {
  font-size: 12px;
  font-weight: 600;
  color: #10b981;
  white-space: nowrap;
}

/* Control Buttons */
.control-button {
  position: relative;
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.control-button:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.button-content {
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;
  z-index: 1;
}

.button-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2));
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 10px;
}

.control-button:hover .button-glow {
  opacity: 1;
}

.theme-icon,
.help-icon {
  width: 16px;
  height: 16px;
  color: rgba(255, 255, 255, 0.8);
  transition: color 0.3s ease;
}

.theme-label,
.help-label {
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  text-transform: capitalize;
  transition: color 0.3s ease;
}

.control-button:hover .theme-icon,
.control-button:hover .help-icon,
.control-button:hover .theme-label,
.control-button:hover .help-label {
  color: rgba(255, 255, 255, 0.95);
}

/* Help Button Specific Styles */
.help-button {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(99, 102, 241, 0.2));
  border-color: rgba(59, 130, 246, 0.3);
}

.help-button:hover {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(99, 102, 241, 0.3));
  border-color: rgba(59, 130, 246, 0.5);
}

.help-glow {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.4), rgba(99, 102, 241, 0.4));
}

/* Animations */
@keyframes logoGlow {
  0% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.6;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  75% {
    transform: scale(2);
    opacity: 0;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

/* Responsive Design */
/* Responsive Design (continued) */
@media (max-width: 768px) {
  .header-content {
    padding: 10px 16px;
    gap: 12px;
  }

  .theme-label,
  .help-label {
    display: none;
  }

  .control-button {
    padding: 8px;
  }

  .connection-text {
    display: none;
  }

  .logo-section {
    gap: 12px;
  }

  .brand-title {
    font-size: 16px;
  }

  .brand-subtitle {
    font-size: 10px;
  }
}

@media (max-width: 640px) {
  .header-content {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 12px 16px;
    gap: 8px;
  }

  .logo-section {
    flex: 1;
    min-width: 200px;
  }

  .controls-section {
    flex-shrink: 0;
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .glassmorphic-header {
    border-radius: 12px;
    margin-bottom: 16px;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
    padding: 12px;
    gap: 12px;
  }

  .logo-section {
    justify-content: center;
    width: 100%;
  }

  .controls-section {
    justify-content: center;
    width: 100%;
  }

  .logo-icon {
    width: 32px;
    height: 32px;
  }

  .logo-icon .icon {
    width: 18px;
    height: 18px;
  }

  .brand-title {
    font-size: 16px;
  }

  .brand-subtitle {
    font-size: 10px;
  }

  .control-button {
    padding: 8px 12px;
  }

  .theme-icon,
  .help-icon {
    width: 14px;
    height: 14px;
  }
}

@media (max-width: 320px) {
  .header-content {
    padding: 10px;
    gap: 10px;
  }

  .controls-section {
    gap: 6px;
  }

  .connection-status {
    padding: 6px 8px;
  }

  .control-button {
    padding: 6px 8px;
  }

  .brand-title {
    font-size: 14px;
  }

  .brand-subtitle {
    font-size: 9px;
  }
}

/* Fix for potential layout issues */
* {
  box-sizing: border-box;
}

.glassmorphic-header {
  width: 100%;
  max-width: 100%;
}

.header-content {
  width: 100%;
  max-width: 100%;
}

/* Ensure proper flexbox behavior */
.logo-section,
.controls-section {
  display: flex;
  align-items: center;
}

.brand-info {
  overflow: hidden;
}

.brand-title,
.brand-subtitle {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Prevent button text from wrapping */
.theme-label,
.help-label,
.connection-text {
  white-space: nowrap;
}
</style>
