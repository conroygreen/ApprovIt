// Sample data for approval requests
const sampleApprovals = [
    {
        id: 1,
        title: 'FDA 510(k) Submission - Medical Device X',
        department: 'Regulatory Affairs',
        priority: 'High',
        status: 'pending',
        date: '2024-01-15',
        description: 'Pre-market notification for new medical device'
    },
    {
        id: 2,
        title: 'Quality Management System Update',
        department: 'Quality Assurance',
        priority: 'Medium',
        status: 'review',
        date: '2024-01-12',
        description: 'ISO 13485 compliance documentation update'
    },
    {
        id: 3,
        title: 'Clinical Trial Protocol Amendment',
        department: 'Clinical',
        priority: 'Critical',
        status: 'pending',
        date: '2024-01-10',
        description: 'Amendment to Phase II trial protocol'
    },
    {
        id: 4,
        title: 'Manufacturing Process Validation',
        department: 'Manufacturing',
        priority: 'High',
        status: 'approved',
        date: '2024-01-08',
        description: 'Validation report for new production line'
    },
    {
        id: 5,
        title: 'Regulatory Compliance Training',
        department: 'Regulatory Affairs',
        priority: 'Low',
        status: 'approved',
        date: '2024-01-05',
        description: 'Annual compliance training certification'
    }
];

// State management
let approvals = [...sampleApprovals];
let nextId = 6;

// DOM Elements
const approvalList = document.getElementById('approvalList');
const newRequestModal = document.getElementById('newRequestModal');
const newRequestBtn = document.getElementById('newRequestBtn');
const closeModalBtn = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const approvalForm = document.getElementById('approvalForm');
const startDemoBtn = document.getElementById('startDemoBtn');
const loginBtn = document.getElementById('loginBtn');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    renderApprovals();
    updateStats();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    newRequestBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    approvalForm.addEventListener('submit', handleFormSubmit);
    startDemoBtn.addEventListener('click', handleStartDemo);
    loginBtn.addEventListener('click', handleLogin);

    // Close modal when clicking outside
    newRequestModal.addEventListener('click', function(e) {
        if (e.target === newRequestModal) {
            closeModal();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && newRequestModal.classList.contains('active')) {
            closeModal();
        }
    });
}

// Render approval list
function renderApprovals() {
    approvalList.innerHTML = approvals.map(approval => `
        <div class="approval-item" data-id="${approval.id}">
            <div class="approval-info">
                <h4>${escapeHtml(approval.title)}</h4>
                <p>${escapeHtml(approval.department)} • ${formatDate(approval.date)}</p>
            </div>
            <div class="approval-meta">
                <span class="priority-badge priority-${approval.priority.toLowerCase()}">${escapeHtml(approval.priority)}</span>
                <span class="status-badge status-${approval.status}">${getStatusLabel(approval.status)}</span>
                ${approval.status === 'pending' || approval.status === 'review' ? `
                    <div class="approval-actions">
                        <button class="btn btn-approve" onclick="handleApprove(${approval.id})">Approve</button>
                        <button class="btn btn-reject" onclick="handleReject(${approval.id})">Reject</button>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Update dashboard statistics
function updateStats() {
    const pending = approvals.filter(a => a.status === 'pending').length;
    const approved = approvals.filter(a => a.status === 'approved').length;
    const rejected = approvals.filter(a => a.status === 'rejected').length;
    const inReview = approvals.filter(a => a.status === 'review').length;

    document.getElementById('pendingCount').textContent = pending;
    document.getElementById('approvedCount').textContent = approved;
    document.getElementById('rejectedCount').textContent = rejected;
    document.getElementById('inReviewCount').textContent = inReview;
}

// Modal functions
function openModal() {
    newRequestModal.classList.add('active');
    document.getElementById('requestTitle').focus();
}

function closeModal() {
    newRequestModal.classList.remove('active');
    approvalForm.reset();
}

// Form submission handler
function handleFormSubmit(e) {
    e.preventDefault();

    const newApproval = {
        id: nextId++,
        title: document.getElementById('requestTitle').value,
        department: document.getElementById('department').value,
        priority: document.getElementById('priority').value,
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        description: document.getElementById('description').value
    };

    approvals.unshift(newApproval);
    renderApprovals();
    updateStats();
    closeModal();
    showToast('Approval request submitted successfully!', 'success');
}

// Approval action handlers
function handleApprove(id) {
    const approval = approvals.find(a => a.id === id);
    if (approval) {
        approval.status = 'approved';
        renderApprovals();
        updateStats();
        showToast(`"${approval.title}" has been approved.`, 'success');
    }
}

function handleReject(id) {
    const approval = approvals.find(a => a.id === id);
    if (approval) {
        approval.status = 'rejected';
        renderApprovals();
        updateStats();
        showToast(`"${approval.title}" has been rejected.`, 'error');
    }
}

// Demo and login handlers
function handleStartDemo() {
    document.getElementById('approvals').scrollIntoView({ behavior: 'smooth' });
    showToast('Welcome to the ApprovIt demo!', 'info');
}

function handleLogin() {
    showToast('Demo mode - Login simulated successfully!', 'info');
}

// Toast notification system
function showToast(message, type = 'info') {
    // Remove existing toasts
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Utility functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function getStatusLabel(status) {
    const labels = {
        pending: 'Pending',
        approved: 'Approved',
        rejected: 'Rejected',
        review: 'In Review'
    };
    return labels[status] || status;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
