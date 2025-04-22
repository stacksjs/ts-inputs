<style scoped>
:root {
  --ts-input-bg: var(--ts-input-bg, #ffffff);
  --ts-input-border: var(--ts-input-border, #e2e8f0);
  --ts-input-border-hover: var(--ts-input-border-hover, #cbd5e1);
  --ts-input-border-focus: var(--ts-input-border-focus, #3b82f6);
  --ts-input-text: var(--ts-input-text, #1e293b);
  --ts-input-placeholder: var(--ts-input-placeholder, #94a3b8);
  --ts-input-shadow: var(--ts-input-shadow, 0 1px 2px rgba(0, 0, 0, 0.05));
  --ts-input-shadow-focus: var(--ts-input-shadow-focus, 0 0 0 3px rgba(59, 130, 246, 0.1));
  --ts-input-radius: var(--ts-input-radius, 0.375rem);
  --ts-input-padding: var(--ts-input-padding, 0.5rem 0.75rem);
  --ts-input-font-size: var(--ts-input-font-size, 0.875rem);
  --ts-input-line-height: var(--ts-input-line-height, 1.25rem);
  --ts-input-transition: var(--ts-input-transition, all 0.2s ease-in-out);
}

.ts-input {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  background-color: var(--ts-input-bg);
  border: 1px solid var(--ts-input-border);
  border-radius: var(--ts-input-radius);
  box-shadow: var(--ts-input-shadow);
  transition: var(--ts-input-transition);
}

.ts-input:hover {
  border-color: var(--ts-input-border-hover);
}

.ts-input:focus-within {
  border-color: var(--ts-input-border-focus);
  box-shadow: var(--ts-input-shadow-focus);
}

.ts-input__input {
  flex: 1;
  width: 100%;
  min-width: 0;
  padding: var(--ts-input-padding);
  font-size: var(--ts-input-font-size);
  line-height: var(--ts-input-line-height);
  color: var(--ts-input-text);
  background: none;
  border: none;
  outline: none;
  transition: var(--ts-input-transition);
}

.ts-input__input::placeholder {
  color: var(--ts-input-placeholder);
}

.ts-input__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.75rem;
  color: var(--ts-input-placeholder);
  transition: var(--ts-input-transition);
}

.ts-input__icon:hover {
  color: var(--ts-input-text);
}

.ts-input--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.ts-input--error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.ts-datepicker__input {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  background-color: var(--ts-input-bg);
  border: 1px solid var(--ts-input-border);
  border-radius: var(--ts-input-radius);
  box-shadow: var(--ts-input-shadow);
  transition: var(--ts-input-transition);
}

.ts-datepicker__input:hover {
  border-color: var(--ts-input-border-hover);
}

.ts-datepicker__input:focus-within {
  border-color: var(--ts-input-border-focus);
  box-shadow: var(--ts-input-shadow-focus);
}

.ts-datepicker__calendar-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.75rem;
  color: var(--ts-input-placeholder);
  transition: var(--ts-input-transition);
}

.ts-datepicker__calendar-icon:hover {
  color: var(--ts-input-text);
}

.ts-datepicker__clear-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.75rem;
  color: var(--ts-input-placeholder);
  transition: var(--ts-input-transition);
  cursor: pointer;
}

.ts-datepicker__clear-button:hover {
  color: var(--ts-input-text);
}

.ts-datepicker__dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 50;
  width: 100%;
  margin-top: 0.25rem;
  background-color: var(--ts-input-bg);
  border: 1px solid var(--ts-input-border);
  border-radius: var(--ts-input-radius);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: var(--ts-input-transition);
}

.ts-datepicker--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.ts-datepicker--error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
</style>
