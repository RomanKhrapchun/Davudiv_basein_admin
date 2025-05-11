const { sqlRequest } = require("../../../helpers/database");
const logger = require("../../../utils/logger");

class SportsComplexRepository {
    async findRequisitesByFilter(limit, offset, filters, allowedFields) {
        let sql = `
            SELECT r.id, r.kved, r.iban, r.edrpou, sg.name AS group_name
            FROM requisites r
            LEFT JOIN service_groups sg ON r.service_group_id = sg.id
            WHERE 1=1`;

        for (const key in allowedFields) {
            sql += ` AND r.${key} ILIKE '%${allowedFields[key]}%'`;
        }

        sql += ` ORDER BY r.id LIMIT ${limit} OFFSET ${offset}`;

        try {
            const result = await sqlRequest(sql);
            const countResult = await sqlRequest(`SELECT COUNT(*) FROM requisites r WHERE 1=1` + Object.keys(allowedFields).map(k => ` AND r.${k} ILIKE '%${allowedFields[k]}%'`).join(""));
            return [result, +countResult[0].count];
        } catch (error) {
            logger.error("[SportsComplexRepository][findRequisitesByFilter]", error);
            throw error;
        }
    }

    async findPoolServicesByFilter(limit, offset, filters, allowedFields) {
        let sql = `
            SELECT s.id, s.name, s.unit, s.price, s.service_group_id
            FROM services s
            WHERE s.service_group_id = 1`;

        for (const key in allowedFields) {
            sql += ` AND s.${key} ILIKE '%${allowedFields[key]}%'`;
        }

        sql += ` ORDER BY s.id LIMIT ${limit} OFFSET ${offset}`;

        try {
            const result = await sqlRequest(sql);
            const countResult = await sqlRequest(`SELECT COUNT(*) FROM services s WHERE s.service_group_id = 1` + Object.keys(allowedFields).map(k => ` AND s.${k} ILIKE '%${allowedFields[k]}%'`).join(""));
            return [result, +countResult[0].count];
        } catch (error) {
            logger.error("[SportsComplexRepository][findPoolServicesByFilter]", error);
            throw error;
        }
    }

    async getById(id) {
        const sql = `SELECT * FROM requisites WHERE id = $1`;
        try {
            const result = await sqlRequest(sql, [id]);
            return result[0];
        } catch (error) {
            logger.error("[getById]", error);
            throw error;
        }
    }

    async getRequisite(id) {
        const sql = `
            SELECT r.*, sg.name AS group_name
            FROM requisites r
            LEFT JOIN service_groups sg ON sg.id = r.service_group_id
            WHERE r.id = $1
        `;
        try {
            const result = await sqlRequest(sql, [id]);
            return result[0];
        } catch (error) {
            logger.error("[getRequisite]", error);
            throw error;
        }
    }
}

module.exports = new SportsComplexRepository();