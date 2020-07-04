import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categorysRepository = getRepository(Category);

    const { total } = await transactionRepository.getBalance();
    if (type === 'outcome' && total < value) {
      throw new AppError('You do not have enough balance');
    }

    let transactionCategory = await categorysRepository.findOne({
      title: category,
    });

    if (!transactionCategory) {
      transactionCategory = await categorysRepository.create({
        title: category,
      });

      await categorysRepository.save(transactionCategory);
    }

    const transaction = await transactionRepository.create({
      category: transactionCategory,
      title,
      value,
      type,
    });

    await transactionRepository.save(transaction);
    transaction.category = transactionCategory;
    return transaction;
  }
}

export default CreateTransactionService;
