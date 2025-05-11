const sportsComplexRepository = require("../repository/sportscomplex-repository");
const logRepository = require("../../log/repository/log-repository");
const logger = require("../../../utils/logger");
const { paginate, paginationData } = require("../../../helpers/paginate");
const { allowedRequisitesFilterFields, allowedServicesFilterFields } = require("../../../utils/constans");

class SportsComplexService {
    async findRequisitesByFilter(request) {
        const { page = 1, limit = 16, ...whereConditions } = request.body;
        const { offset } = paginate(page, limit);
        const allowedFields = allowedRequisitesFilterFields.filter(el => whereConditions.hasOwnProperty(el)).reduce((acc, key) => ({ ...acc, [key]: whereConditions[key] }), {});

        const data = await sportsComplexRepository.findRequisitesByFilter(limit, offset, whereConditions, allowedFields);

        if (Object.keys(whereConditions).length > 0) {
            await logRepository.createLog({
                row_pk_id: null,
                uid: request?.user?.id,
                action: 'SEARCH',
                client_addr: request?.ip,
                application_name: 'Пошук реквізитів',
                action_stamp_tx: new Date(),
                action_stamp_stm: new Date(),
                action_stamp_clk: new Date(),
                schema_name: 'public',
                table_name: 'requisites',
                oid: '16504',
            });
        }

        return paginationData(data[0], page, limit, data[1]);
    }

    async findPoolServicesByFilter(request) {
        const { page = 1, limit = 16, ...whereConditions } = request.body;
        const { offset } = paginate(page, limit);
        const allowedFields = allowedServicesFilterFields.filter(el => whereConditions.hasOwnProperty(el)).reduce((acc, key) => ({ ...acc, [key]: whereConditions[key] }), {});

        const data = await sportsComplexRepository.findPoolServicesByFilter(limit, offset, whereConditions, allowedFields);

        if (Object.keys(whereConditions).length > 0) {
            await logRepository.createLog({
                row_pk_id: null,
                uid: request?.user?.id,
                action: 'SEARCH',
                client_addr: request?.ip,
                application_name: 'Пошук послуг басейну',
                action_stamp_tx: new Date(),
                action_stamp_stm: new Date(),
                action_stamp_clk: new Date(),
                schema_name: 'public',
                table_name: 'services',
                oid: '16505',
            });
        }

        return paginationData(data[0], page, limit, data[1]);
    }

    async getById(id) {
        try {
            return await sportsComplexRepository.getById(id);
        } catch (error) {
            logger.error("[SportsComplexService][getById]", error);
            throw error;
        }
    }

    async generateWordById(id) {
        try {
            const data = await sportsComplexRepository.getRequisite(id);
            return await createRequisiteWord(data);
        } catch (error) {
            logger.error("[SportsComplexService][generateWordById]", error);
            throw error;
        }
    }

    async printById(id) {
        try {
            return await sportsComplexRepository.getRequisite(id);
        } catch (error) {
            logger.error("[SportsComplexService][printById]", error);
            throw error;
        }
    }
}

module.exports = new SportsComplexService();