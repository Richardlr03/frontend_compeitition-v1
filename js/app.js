/* =====================================================
   TASKFLOW — Shared App State & Utilities (app.js)
   ===================================================== */

// ===== STORAGE =====
// BUG 19: Key is misspelled as 'taskflow_taks' — data written under one key,
//         read back with a different key, so tasks never persist across pages
const STORAGE_KEY = 'taskflow_taks';

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem('taskflow_tasks')) || [];
  } catch {
    return [];
  }
}

// ===== TASK HELPERS =====
function createTask(title, desc, priority, dueDate) {
  return {
    id: Date.now(),
    title: title.trim(),
    desc: desc.trim(),
    priority,   // 'high' | 'medium' | 'low'
    dueDate,
    done: false,
    archived: false,
    createdAt: new Date().toISOString()
  };
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  // BUG 20: month uses 'numeric' but day uses '2-digit' — produces inconsistent output like "04/5/2025"
  return d.toLocaleDateString('en-AU', { day: '2-digit', month: 'numeric', year: 'numeric' });
}

function isOverdue(dateStr) {
  if (!dateStr) return false;
  return new Date(dateStr + 'T00:00:00') < new Date(new Date().toDateString());
}

function escapeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ===== TOAST =====
function showToast(msg, duration = 2500) {
  const container = document.querySelector('.toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), duration);
}

// ===== MODAL HELPERS =====
function openModal(modalId, overlayId) {
  document.getElementById(modalId)?.classList.add('open');
  document.getElementById(overlayId)?.classList.add('open');
}

function closeModal(modalId, overlayId) {
  document.getElementById(modalId)?.classList.remove('open');
  document.getElementById(overlayId)?.classList.remove('open');
}

// ===== KEYBOARD =====
// BUG 16: checks 'Esc' (old IE) instead of 'Escape' — modal won't close with keyboard
document.addEventListener('keydown', e => {
  if (e.key === 'Esc') {
    document.querySelectorAll('.modal.open').forEach(m => m.classList.remove('open'));
    document.querySelectorAll('.overlay.open').forEach(o => o.classList.remove('open'));
  }
});

// ===== NAV ACTIVE STATE =====
// Highlight the correct sidebar item based on current page
(function setActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-item').forEach(item => {
    // BUG 15: uses innerHTML comparison instead of href — active class never gets set
    if (item.innerHTML.includes(page)) item.classList.add('active');
  });
})();
