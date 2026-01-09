// Wallet Logic
document.addEventListener('DOMContentLoaded', async function() {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (currentUser) {
        await loadUserBalance();
        await loadTransactionsFromFirestore();
    } else {
        // Fallback to localStorage
        const user = getCurrentUser();
        updateBalances(user);
        loadTransactions();
    }
});

async function loadUserBalance() {
    const auth = getAuth();
    const db = getFirestore();
    const currentUser = auth.currentUser;
    
    if (!currentUser) return;
    
    try {
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        if (userDoc.exists) {
            const userData = userDoc.data();
            updateBalances(userData);
            
            // Update localStorage
            saveUserData(userData);
        }
    } catch (error) {
        console.error('Error loading user balance:', error);
    }
}

async function loadTransactionsFromFirestore() {
    const auth = getAuth();
    const db = getFirestore();
    const currentUser = auth.currentUser;
    const container = document.getElementById('transactionsList');
    
    if (!currentUser || !container) {
        loadTransactions();
        return;
    }
    
    try {
        const snapshot = await db.collection('transactions')
            .where('userId', '==', currentUser.uid)
            .orderBy('createdAt', 'desc')
            .limit(50)
            .get();
        
        if (snapshot.empty) {
            container.innerHTML = `
                <div style="text-align: center; padding: var(--spacing-3xl); color: var(--text-secondary);">
                    <p>No transactions yet</p>
                </div>
            `;
            return;
        }
        
        const transactions = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        container.innerHTML = transactions.map(transaction => createTransactionItem(transaction)).join('');
    } catch (error) {
        console.error('Error loading transactions:', error);
        loadTransactions();
    }
}

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
    const icon = isCredit ? '<i class="fas fa-coins"></i>' : '<i class="fas fa-minus-circle"></i>';
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
                ${amountPrefix}${Math.abs(transaction.amount)} <i class="fas fa-coins"></i>
            </div>
        </div>
    `;
}

async function addCoins() {
    const amount = prompt('How many coins would you like to add?');
    
    if (amount && !isNaN(amount) && parseInt(amount) > 0) {
        const coins = parseInt(amount);
        const auth = getAuth();
        const currentUser = auth.currentUser;
        
        if (!currentUser) {
            alert('Please login to add coins');
            return;
        }
        
        // Mock implementation - no Firebase needed
        try {
            // Update localStorage
            const user = getCurrentUser();
            user.coins += coins;
            saveUserData(user);
            
            // Add transaction record (mock)
            const transactions = getTransactions();
            transactions.unshift({
                id: transactions.length + 1,
                date: new Date().toISOString().split('T')[0],
                description: 'Coins added to wallet',
                amount: coins,
                type: 'credit',
                createdAt: new Date().toISOString()
            });
            
            alert(`✅ ${coins} coins added to your wallet!`);
            location.reload();
        } catch (error) {
            console.error('Error adding coins:', error);
            alert('❌ Failed to add coins. Please try again.');
        }
    } else if (amount !== null) {
        alert('Please enter a valid amount');
    }
}

async function withdrawCoins() {
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
        
        const auth = getAuth();
        const currentUser = auth.currentUser;
        
        if (!currentUser) {
            alert('Please login to withdraw coins');
            return;
        }
        
        const db = getFirestore();
        
        try {
            // Update user coins
            await db.collection('users').doc(currentUser.uid).update({
            // Update localStorage
            user.coins -= coins;
            saveUserData(user);
            
            // Add transaction record (mock)
            const transactions = getTransactions();
            transactions.unshift({
                id: transactions.length + 1,
                date: new Date().toISOString().split('T')[0],
                description: 'Withdrawal to bank account',
                amount: -coins,
                type: 'debit',
                createdAt: new Date().toISOString()
            });
            
            alert(`✅ Withdrawal of ${coins} coins initiated!\n\nThe amount will be transferred to your bank account within 2-3 business days.`);
            location.reload();
        } catch (error) {
            console.error('Error withdrawing coins:', error);
            alert('❌ Failed to withdraw coins. Please try again.');
        }
    } else if (amount !== null) {
        alert('Please enter a valid amount');
    }
}
