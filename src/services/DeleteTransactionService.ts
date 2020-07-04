import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    try {
      const transactionRepository = getCustomRepository(TransactionRepository);
      await transactionRepository.delete(id);
    } catch (error) {
      throw new AppError('Error to delete this transaction', 400);
    }
  }
}

export default DeleteTransactionService;
