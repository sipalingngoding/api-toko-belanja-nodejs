const transactionService = new (require('../service/transaction-service'));
class TransactionController {
    async add(req,res,next){
        try {
            const id = await transactionService.add({...req.body, userId : req.userId});
            return res.status(201).json({
                status : 'success',
                data : {
                    id,
                },
            })
        }catch (e) {
            next(e)
        }
    }

    async getTransactionUser(req,res,next){
        try {
            const transactions = await transactionService.getTransactionUser(req.userId);
            return res.json({
                status : 'success',
                data : {
                    transactions,
                },
            })
        }catch (e) {
            next(e);
        }
    }

    async getTransactionAdmin(req,res,next){
        try {
            const transactions = await transactionService.getTransactionAdmin();
            return res.json({
                status : 'success',
                data : {
                    transactions,
                },
            })
        }catch (e) {
            next(e);
        }
    }

    async getTransactionOne(req,res,next){
        try {
            const transaction = await transactionService.getTransactionId(req.params.transactionId);
            return res.json({
                status : 'success',
                data : {
                    transaction,
                },
            })
        }catch (e) {
            next(e);
        }
    }
}


module.exports = TransactionController;