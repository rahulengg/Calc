// Simple calculator logic
(function () {
  const displayEl = document.getElementById('display');
  let expr = '';

  function updateDisplay() {
    displayEl.textContent = expr === '' ? '0' : expr;
  }

  function appendValue(val) {
    // Prevent multiple leading zeros (simple behavior)
    if (expr === '0' && val === '0') return;
    if (expr === '0' && val !== '.' && /[0-9]/.test(val)) {
      expr = val;
    } else {
      expr += val;
    }
    updateDisplay();
  }

  function clearAll() {
    expr = '';
    updateDisplay();
  }

  function backspace() {
    expr = expr.slice(0, -1);
    updateDisplay();
  }

  function calculate() {
    if (!expr) return;
    // Allow only digits, operators, parentheses, dot and spaces
    if (!/^[0-9+\-*/().\s]+$/.test(expr)) {
      displayEl.textContent = 'Error';
      expr = '';
      return;
    }
    try {
      // Use Function to evaluate safely-ish after validation
      // Replace multiplication/division symbols if present
      const sanitized = expr.replace(/×/g, '*').replace(/÷/g, '/');
      const result = Function('"use strict";return (' + sanitized + ')')();
      expr = String(result);
      updateDisplay();
    } catch (e) {
      displayEl.textContent = 'Error';
      expr = '';
    }
  }

  // Button clicks
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const v = btn.getAttribute('data-value');
      const action = btn.getAttribute('data-action');

      if (action === 'clear') {
        clearAll();
        return;
      }
      if (action === 'backspace') {
        backspace();
        return;
      }
      if (action === 'calculate') {
        calculate();
        return;
      }
      if (v) appendValue(v);
    });
  });

  // Keyboard support
  window.addEventListener('keydown', (ev) => {
    const key = ev.key;
    if (key === 'Enter' || key === '=') {
      ev.preventDefault();
      calculate();
      return;
    }
    if (key === 'Backspace') {
      ev.preventDefault();
      backspace();
      return;
    }
    if (key === 'Escape') {
      ev.preventDefault();
      clearAll();
      return;
    }
    // allow digits and operators and parentheses and dot
    if (/^[0-9+\-*/().]$/.test(key)) {
      ev.preventDefault();
      appendValue(key);
      return;
    }
  });

  // Initialize
  updateDisplay();
})();