// Wallet Logic
document.addEventListener('DOMContentLoaded', function() {
    const user = getCurrentUser();
    
    // Update balances
    updateBalances(user);
    
    // Load transaction history
    loadTransactions();
});

function updateBalances(user) {
    document.getElementById('totalCoins').textContent = user.coins.toLocaleString();
    document.getElementById('lockedCoins').textContent = (user.lockedCoins || 0).toLocaleString();
    document.getElementById('earnedCoins').textContent = (user.earnedCoins || 0).toLocaleString();
}

function loadTransactions() {
    const container = document.getElementById('transactionsList');
    const transactions = getTransactions();
    
    if (!container) return;
    
    if (transactions.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: var(--spacing-3xl); color: var(--text-secondary);">
                <p>No transactions yet</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = transactions.map(transaction => createTransactionItem(transaction)).join('');
}

function createTransactionItem(transaction) {
    const isCredit = transaction.type === 'credit';
    const icon = isCredit ? '💰' : '💸';
    const amountPrefix = isCredit ? '+' : '';
    
    return `
        <div class="transaction-item">
            <div class="transaction-icon ${transaction.type}">
                ${icon}
            </div>
            <div class="transaction-details">
                <div class="transaction-description">${transaction.description}</div>
                <div class="transaction-date">${transaction.date}</div>
            </div>
            <div class="transaction-amount ${transaction.type}">
                ${amountPrefix}${Math.abs(transaction.amount)} 💰
            </div>
        </div>
    `;
}

function addCoins() {
    const amount = prompt('How many coins would you like to add?\n\n(Note: This is a UI simulation only)');
    
    if (amount && !isNaN(amount) && parseInt(amount) > 0) {
        const coins = parseInt(amount);
        
        // Update user coins
        const user = getCurrentUser();
        user.coins += coins;
        localStorage.setItem('workcoin_user', JSON.stringify(user));
        
        // Add transaction
        const transactions = getTransactions();
        transactions.unshift({
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            description: 'Coins added to wallet',
            amount: coins,
            type: 'credit'
        });
        
        alert(`✅ ${coins} coins added to your wallet!`);
        
        // Reload page
        location.reload();
    } else if (amount !== null) {
        alert('Please enter a valid amount');
    }
}

function withdrawCoins() {
    const user = getCurrentUser();
    
    if (user.coins === 0) {
        alert('You don\'t have any coins to withdraw.');
        return;
    }
    
    const amount = prompt(`Available balance: ${user.coins} coins\n\nHow many coins would you like to withdraw?`);
    
    if (amount && !isNaN(amount) && parseInt(amount) > 0) {
        const coins = parseInt(amount);
        
        if (coins > user.coins) {
            alert('Insufficient balance!');
            return;
        }
        
        // Update user coins
        user.coins -= coins;
        localStorage.setItem('workcoin_user', JSON.stringify(user));
        
        // Add transaction
        const transactions = getTransactions();
        transactions.unshift({
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            description: 'Withdrawal to bank account',
            amount: -coins,
            type: 'debit'
        });
        
        alert(`✅ Withdrawal of ${coins} coins initiated!\n\nThe amount will be transferred to your bank account within 2-3 business days.`);
        
        // Reload page
        location.reload();
    } else if (amount !== null) {
        alert('Please enter a valid amount');
    }
}
