
const kindergardenRepository = require("../repository/kindergarden-repositiry");
const { fieldsListMissingError, NotFoundErrorMessage } = require("../../../utils/messages")
const { paginate, paginationData, addRequisiteToLandDebt } = require("../../../utils/function");
const { displayKindergardenFields, allowedKindergardenTableFilterFields } = require("../../../utils/constans");
const { createRequisiteWord } = require("../../../utils/generateDocx");
const logRepository = require("../../log/repository/log-repository");

class KindergardenService {

    async getDebtByDebtorId(request) {
        if (!Object.keys([displayKindergardenFields]).length) {
            throw new Error(fieldsListMissingError)
        }
        return await kindergardenRepository.getDebtByDebtorId(request?.params?.id, displayKindergardenFields)
    }

    async findDebtByFilter(request) {
        const { page = 1, limit = 16, title, ...whereConditions } = request.body
        const { offset } = paginate(page, limit)
        const allowedFields = allowedKindergardenTableFilterFields.filter(el => whereConditions.hasOwnProperty(el)).reduce((acc, key) => ({ ...acc, [key]: whereConditions[key] }), {})
        const userData = await kindergardenRepository.findDebtByFilter(limit, offset, title, allowedFields, displayKindergardenFields)
        if (title || whereConditions?.child_name) {
            await logRepository.createLog({
                row_pk_id: null,
                uid: request?.user?.id,
                action: 'SEARCH',
                client_addr: request?.ip,
                application_name: 'Пошук боржника',
                action_stamp_tx: new Date(),
                action_stamp_stm: new Date(),
                action_stamp_clk: new Date(),
                schema_name: 'ower',
                table_name: 'ower',
                oid: '16504',
            })
        }
        return paginationData(userData[0], page, limit)
    }

    async generateWordByDebtId(request, reply) {
        if (!Object.keys([displayKindergardenFields]).length) {
            throw new Error(fieldsListMissingError)
        }
        const fetchData = await kindergardenRepository.getDebtByDebtorId(request?.params?.id, displayKindergardenFields)
        if (!fetchData.length) {
            throw new Error(NotFoundErrorMessage)
        }
        const fetchRequisite = await kindergardenRepository.getRequisite()
        if (!fetchRequisite.length) {
            throw new Error(NotFoundErrorMessage)
        }

        if (fetchData[0].debt_amount) {
            const result = await createRequisiteWord(fetchData[0], fetchRequisite[0])
            await logRepository.createLog({
                row_pk_id: fetchData[0].id,
                uid: request?.user?.id,
                action: 'GENERATE_DOC',
                client_addr: request?.ip,
                application_name: 'Генерування документа для боржника',
                action_stamp_tx: new Date(),
                action_stamp_stm: new Date(),
                action_stamp_clk: new Date(),
                schema_name: 'ower',
                table_name: 'ower',
                oid: '16504',
            })
            reply.header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            reply.header('Content-Disposition', 'attachment; filename=generated.docx');
            return reply.send(result);
        }

        throw new Error("Немає даних для формування документу.")

    }

    async printDebtId(request, reply) {
        if (!Object.keys([displayKindergardenFields]).length) {
            throw new Error(fieldsListMissingError)
        }
        const fetchData = await kindergardenRepository.getDebtByDebtorId(request?.params?.id, displayKindergardenFields)
        if (!fetchData.length) {
            throw new Error(NotFoundErrorMessage)
        }
        const fetchRequisite = await kindergardenRepository.getRequisite()
        if (!fetchRequisite.length) {
            throw new Error(NotFoundErrorMessage)
        }

        if (fetchData[0].debt_amount) {
            const result = addRequisiteToLandDebt(fetchData[0], fetchRequisite[0]);
            await logRepository.createLog({
                row_pk_id: fetchData[0].id,
                uid: request?.user?.id,
                action: 'PRINT',
                client_addr: request?.ip,
                application_name: 'Друк документа',
                action_stamp_tx: new Date(),
                action_stamp_stm: new Date(),
                action_stamp_clk: new Date(),
                schema_name: 'ower',
                table_name: 'ower',
                oid: '16504',
            })
            return reply.send({
                name: fetchData[0].name,
                date: fetchData[0].date,
                identification: fetchData[0].identification,
                debt: result
            });
        }

        throw new Error("Немає даних для формування документу.")
    }


}

module.exports = new KindergardenService();