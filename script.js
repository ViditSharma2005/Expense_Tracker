document.addEventListener('DOMContentLoaded', () => {
    // State Management
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let monthlyBudget = parseFloat(localStorage.getItem('monthlyBudget')) || 0;
    let currentTheme = localStorage.getItem('theme') || 'light';

    // DOM Elements - Navigation & Theme
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav a');
    const themeToggleBtn = document.getElementById('themeToggle');
    const resetBtn = document.getElementById('resetBtn');

    // DOM Elements - Sections
    const heroSection = document.querySelector('.hero-content');
    const transactionSection = document.querySelector('.transaction');
    const searchSection = document.querySelector('.search-trans');
    const budgetSection = document.querySelector('.budget-section');

    // DOM Elements - Forms & Inputs
    const transForm = document.getElementById('trans-form');
    const descInput = document.getElementById('descInput');
    const amountInput = document.getElementById('amountInput');
    const typeSelect = document.getElementById('typeSelect');
    const categorySelect = document.getElementById('categorySelect');

    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const filterType = document.getElementById('filterType');
    const filterCategory = document.getElementById('filterCategory');
    const transactionList = document.getElementById('transactionList');

    const budgetForm = document.getElementById('budgetForm');
    const budgetInput = document.getElementById('budgetInput');

    // DOM Elements - Displays
    const totalBalanceEl = document.getElementById('totalBalance');
    const totalIncomeEl = document.getElementById('totalIncome');
    const totalExpensesEl = document.getElementById('totalExpenses');
    const monthlyBudgetEl = document.getElementById('monthlyBudget');
    const displayBudgetEl = document.getElementById('displayBudget');
    const displayRemainingEl = document.getElementById('displayRemaining');

    /* ==========================================
       1. NAVIGATION & SECTION SWITCHING
       ========================================== */
    function showSection(targetId) {
        heroSection.classList.remove('active-section');
        transactionSection.classList.remove('active-section');
        searchSection.classList.remove('active-section');
        budgetSection.classList.remove('active-section');

        if (targetId === 'dashboard') {
            heroSection.classList.add('active-section');
        } else if (targetId === 'transactions') {
            transactionSection.classList.add('active-section');
            searchSection.classList.add('active-section');
        } else if (targetId === 'budget') {
            budgetSection.classList.add('active-section');
        }
    }

    showSection('dashboard');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').replace('#', '');
            showSection(targetId);

            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    });

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    /* ==========================================
       RESET DASHBOARD & LOCALSTORAGE
       ========================================== */
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm("Are you sure you want to reset all data? This will clear all transactions and settings.")) {
                localStorage.clear();
                transactions = [];
                monthlyBudget = 0;
                transForm.reset();
                searchForm.reset();
                updateCategoryOptions();
                updateTotals();
                renderTransactions();
            }
        });
    }

    /* ==========================================
       2. LIGHT / DARK THEME TOGGLE
       ========================================== */
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggleBtn.textContent = 'Light Mode';
        } else {
            document.body.classList.remove('dark-theme');
            themeToggleBtn.textContent = 'Dark Mode';
        }
    }

    applyTheme(currentTheme);

    themeToggleBtn.addEventListener('click', () => {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
        applyTheme(currentTheme);
    });

    /* ==========================================
       DYNAMIC CATEGORY DROPDOWNS
       ========================================== */
    typeSelect.addEventListener('change', () => {
        const selectedType = typeSelect.value;
        categorySelect.innerHTML = '<option value="" disabled selected>Select Category</option>';

        const categories = selectedType === 'income' 
            ? ['Salary', 'Pocket Money', 'Freelance', 'Business', 'Investment']
            : ['Food', 'Travel', 'Shopping', 'Bills', 'Entertainment'];

        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.toLowerCase().replace(/\s+/g, '-');
            option.textContent = cat;
            categorySelect.appendChild(option);
        });
    });

    // Populate Search Category Filter Dynamically
    function updateCategoryOptions() {
        filterCategory.innerHTML = '<option value="all">All Categories</option>';
        const allCategories = ['salary', 'pocket-money', 'freelance', 'business', 'investment', 'food', 'travel', 'shopping', 'bills', 'entertainment'];
        
        allCategories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ');
            filterCategory.appendChild(option);
        });
    }
    updateCategoryOptions();

    /* ==========================================
       3. CALCULATIONS & STATS UPDATES
       ========================================== */
    function updateTotals() {
        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const expenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const balance = income - expenses;
        const remainingBudget = monthlyBudget - expenses;

        totalBalanceEl.textContent = balance.toFixed(2);
        totalIncomeEl.textContent = income.toFixed(2);
        totalExpensesEl.textContent = expenses.toFixed(2);
        monthlyBudgetEl.textContent = monthlyBudget.toFixed(2);
        displayBudgetEl.textContent = monthlyBudget.toFixed(2);
        displayRemainingEl.textContent = remainingBudget.toFixed(2);
    }

    /* ==========================================
       4. SEARCH & TRANSACTION CARDS RENDER
       ========================================== */
    function renderTransactions() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const selectedType = filterType.value;
        const selectedCategory = filterCategory.value;

        transactionList.innerHTML = '';

        const sortedTransactions = [...transactions].reverse();

        // Search Results Matching Type, Category & Search Input
        const filteredTransactions = sortedTransactions.filter(t => {
            const matchesSearch = t.description.toLowerCase().includes(searchTerm);
            const matchesType = selectedType === 'all' || t.type === selectedType;
            const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
            return matchesSearch && matchesType && matchesCategory;
        });

        if (filteredTransactions.length === 0) {
            transactionList.innerHTML = '<p style="color: var(--text-muted); text-align: center;">No transactions found.</p>';
            return;
        }

        filteredTransactions.forEach(t => {
            transactionList.appendChild(createTransactionCard(t));
        });
    }

    // Helper: Create Transaction Cards with Type, Category, Amount & Color rules
    function createTransactionCard(t) {
        const isIncome = t.type === 'income';
        const cardColor = isIncome ? 'var(--clr-blue)' : 'var(--clr-red)';

        const card = document.createElement('div');
        card.className = `transaction-card`;
        card.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            background: var(--card-bg);
            border-radius: 10px;
            border-left: 5px solid ${cardColor};
            box-shadow: var(--card-shadow);
        `;

        card.innerHTML = `
            <div>
                <strong style="font-size: 1rem; display: block;">${t.description}</strong>
                <small style="color: var(--text-muted); text-transform: capitalize;">
                    Category: <b>${t.category.replace('-', ' ')}</b> | Type: <b style="color: ${cardColor}">${t.type}</b>
                </small>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
                <span style="font-size: 1.1rem; font-weight: 800; color: ${cardColor};">
                    ${isIncome ? '+' : '-'} ₹${t.amount.toFixed(2)}
                </span>
                <button onclick="deleteTransaction(${t.id})" style="background: none; border: none; color: var(--clr-red); cursor: pointer; font-size: 1rem;">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
        return card;
    }

    // Submit listener for Search Form
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        renderTransactions();
    });

    // Add New Transaction
    transForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newTransaction = {
            id: Date.now(),
            description: descInput.value.trim(),
            amount: parseFloat(amountInput.value),
            type: typeSelect.value,
            category: categorySelect.value
        };

        transactions.push(newTransaction);
        localStorage.setItem('transactions', JSON.stringify(transactions));

        transForm.reset();
        categorySelect.innerHTML = '<option value="" disabled selected>Select Category</option>';
        updateTotals();
        renderTransactions();
    });

    // Delete Transaction
    window.deleteTransaction = function(id) {
        transactions = transactions.filter(t => t.id !== id);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        updateTotals();
        renderTransactions();
    };

    /* ==========================================
       5. BUDGET MANAGEMENT
       ========================================== */
    budgetForm.addEventListener('submit', (e) => {
        e.preventDefault();
        monthlyBudget = parseFloat(budgetInput.value);
        localStorage.setItem('monthlyBudget', monthlyBudget);
        budgetInput.value = '';
        updateTotals();
    });

    // Initial Render
    updateTotals();
    renderTransactions();
});