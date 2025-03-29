const mongoose = require('mongoose');

const WalletTransactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['credit', 'debit'], required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true }
},
    {
        timestamps: true
    });

const WalletTransaction = mongoose.model('WalletTransaction', WalletTransactionSchema);
module.exports = WalletTransaction;