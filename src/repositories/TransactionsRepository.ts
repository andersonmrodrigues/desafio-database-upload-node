import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();
    const incomeSum = transactions.reduce((sum, transaction) => {
      if (transaction.type === 'income') {
        return sum + Number(transaction.value);
      }
      return sum;
    }, 0);

    const outcomeSum = transactions.reduce((sum, transaction) => {
      if (transaction.type === 'outcome') {
        return sum + Number(transaction.value);
      }
      return sum;
    }, 0);

    const balance: Balance = {
      income: incomeSum,
      outcome: outcomeSum,
      total: incomeSum - outcomeSum,
    };
    return balance;
  }
}

export default TransactionsRepository;
