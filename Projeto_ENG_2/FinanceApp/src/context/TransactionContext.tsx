import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Transaction {
  id: string;
  description: string;
  amount: number; // Positivo para receitas, negativo para despesas
  category: string; // Ex: 'Alimentação', 'Salário', 'Transporte'
  date: string; // Formato 'YYYY-MM-DD'
}

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  removeTransaction: (id: string) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};

interface TransactionProviderProps {
  children: ReactNode;
}

export const TransactionProvider: React.FC<TransactionProviderProps> = ({ children }) => {
  // Dados iniciais mockados
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      description: 'Salário',
      amount: 3000,
      category: 'Salário',
      date: '2025-10-01'
    },
    {
      id: '2',
      description: 'Compra no supermercado',
      amount: -150,
      category: 'Alimentação',
      date: '2025-10-15'
    },
    {
      id: '3',
      description: 'Combustível',
      amount: -80,
      category: 'Transporte',
      date: '2025-10-20'
    },
    {
      id: '4',
      description: 'Restaurante',
      amount: -45,
      category: 'Alimentação',
      date: '2025-10-25'
    },
    {
      id: '5',
      description: 'Freelance',
      amount: 500,
      category: 'Trabalho Extra',
      date: '2025-10-30'
    }
  ]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(), // ID único baseado em timestamp
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const removeTransaction = (id: string) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  };

  return (
    <TransactionContext.Provider value={{ transactions, addTransaction, removeTransaction }}>
      {children}
    </TransactionContext.Provider>
  );
};