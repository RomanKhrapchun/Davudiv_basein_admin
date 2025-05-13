// файл: back/modules/sportcomplex/repository/sportscomplex-repository.js

const { sqlRequest } = require("../../../helpers/database");
const logger = require("../../../utils/logger");
const { buildWhereCondition } = require("../../../utils/function");

class SportsComplexRepository {
    async findRequisitesByFilter(limit, offset, filters, allowedFields) {
        let sql = `
            SELECT r.id, r.kved, r.iban, r.edrpou, sg.name AS group_name
            FROM sport.requisites r
            LEFT JOIN sport.service_groups sg ON r.service_group_id = sg.id
            WHERE 1=1`;

        for (filters in allowedFields) {
            sql += ` AND r.${filters} ILIKE '%${allowedFields[filters]}%'`;
        }

        sql += ` ORDER BY r.id LIMIT ${limit} OFFSET ${offset}`;

        try {
            const result = await sqlRequest(sql);
            const countResult = await sqlRequest(`SELECT COUNT(*) FROM sport.requisites r WHERE 1=1` + Object.keys(allowedFields).map(k => ` AND r.${k} ILIKE '%${allowedFields[k]}%'`).join(""));
            return [result, +countResult[0].count];
        } catch (error) {
            logger.error("[SportsComplexRepository][findRequisitesByFilter]", error);
            throw error;
        }
    }

    async findPoolServicesByFilter(limit, offset, filters, allowedFields) {
        let sql = `
            SELECT s.id, s.name AS serviceName, s.unit, s.price, s.service_group_id
            FROM sport.services s
            WHERE s.service_group_id = 1`;

        for (filters in allowedFields) {
            sql += ` AND s.${filters} ILIKE '%${allowedFields[filters]}%'`;
        }

        sql += ` ORDER BY s.id LIMIT ${limit} OFFSET ${offset}`;

        try {
            const result = await sqlRequest(sql);
            const countResult = await sqlRequest(`SELECT COUNT(*) FROM sport.services s WHERE s.service_group_id = 1` + Object.keys(allowedFields).map(k => ` AND s.${k} ILIKE '%${allowedFields[k]}%'`).join(""));
            return [result, +countResult[0].count];
        } catch (error) {
            logger.error("[SportsComplexRepository][findPoolServicesByFilter]", error);
            throw error;
        }
    }

    async getById(id) {
        const sql = `SELECT * FROM sport.requisites WHERE id = $1`;
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
            FROM sport.requisites r
            LEFT JOIN sport.service_groups sg ON sg.id = r.service_group_id
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

    // Нові методи для роботи з рахунками

    async createPoolService(data) {
        const sql = `
            INSERT INTO services 
            (name, unit, price, service_group_id) 
            VALUES ($1, $2, $3, $4)
            RETURNING id`;
        try {
            const result = await sqlRequest(sql, [data.name, data.unit, data.price, data.service_group_id]);
            return result[0];
        } catch (error) {
            logger.error("[SportsComplexRepository][createPoolService]", error);
            throw error;
        }
    }

    async createRequisite(data) {
        const sql = `
            INSERT INTO requisites 
            (kved, iban, edrpou, service_group_id) 
            VALUES ($1, $2, $3, $4)
            RETURNING id`;
        try {
            const result = await sqlRequest(sql, [data.kved, data.iban, data.edrpou, data.service_group_id]);
            return result[0];
        } catch (error) {
            logger.error("[SportsComplexRepository][createRequisite]", error);
            throw error;
        }
    }

    async getServiceGroups() {
        const sql = `SELECT id, name FROM sport.service_groups ORDER BY id`;
        try {
            return await sqlRequest(sql);
        } catch (error) {
            logger.error("[SportsComplexRepository][getServiceGroups]", error);
            throw error;
        }
    }

    async getServicesByGroup(groupId) {
        const sql = `
            SELECT id, name, unit, price, service_group_id
            FROM sport.services
            WHERE service_group_id = $1
            ORDER BY name`;
        try {
            return await sqlRequest(sql, [groupId]);
        } catch (error) {
            logger.error("[SportsComplexRepository][getServicesByGroup]", error);
            throw error;
        }
    }

    async createBill(data) {
        try {
            // Спочатку отримуємо інформацію про послугу для розрахунку загальної вартості
            const serviceInfo = await sqlRequest(
                `SELECT price FROM sport.services WHERE id = $1`,
                [data.service_id]
            );
            
            if (!serviceInfo.length) {
                throw new Error('Послугу не знайдено');
            }
            
            const totalPrice = serviceInfo[0].price * data.quantity;
            
            // Створюємо рахунок
            const sql = `
                INSERT INTO payments
                (account_number, payer, service_id, quantity, total_price, status)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id`;
                
            const result = await sqlRequest(sql, [
                data.account_number,
                data.payer,
                data.service_id,
                data.quantity,
                totalPrice,
                data.status
            ]);
            
            return result[0];
        } catch (error) {
            logger.error("[SportsComplexRepository][createBill]", error);
            throw error;
        }
    }

    async findBillsByFilter(limit, offset, title, whereConditions = {}, displayFields = []) {
        const values = [];
        
        let sql = `
            SELECT 
                p.id,
                p.account_number,
                p.payer,
                sg.name AS service_group,
                s.name AS service_name,
                s.unit,
                p.quantity,
                p.total_price AS amount,
                p.status
            FROM 
                sport.payments p
            JOIN 
                sport.services s ON p.service_id = s.id
            JOIN 
                sport.service_groups sg ON s.service_group_id = sg.id
            WHERE 1=1`;

        if (Object.keys(whereConditions).length) {
            const data = buildWhereCondition(whereConditions);
            sql += data.text;
            values.push(...data.value);
        }

        if (title) {
            sql += ` AND (p.account_number ILIKE ? OR p.payer ILIKE ?)`;
            values.push(`%${title}%`, `%${title}%`);
        }

        values.push(limit, offset);
        sql += ` ORDER BY p.id DESC LIMIT ? OFFSET ?`;

        try {
            const result = await sqlRequest(sql, values);
            
            // Count query
            let countSql = `
                SELECT COUNT(*) AS count
                FROM 
                    sport.payments p
                JOIN 
                    sport.services s ON p.service_id = s.id
                JOIN 
                    sport.service_groups sg ON s.service_group_id = sg.id
                WHERE 1=1`;
                
            const countValues = [];
            
            if (Object.keys(whereConditions).length) {
                const data = buildWhereCondition(whereConditions);
                countSql += data.text;
                countValues.push(...data.value);
            }
            
            if (title) {
                countSql += ` AND (p.account_number ILIKE ? OR p.payer ILIKE ?)`;
                countValues.push(`%${title}%`, `%${title}%`);
            }
            
            const countResult = await sqlRequest(countSql, countValues);
            
            return [result, +countResult[0].count];
        } catch (error) {
            logger.error("[SportsComplexRepository][findBillsByFilter]", error);
            throw error;
        }
    }

    async getBillById(id) {
        try {
            const sql = `
                SELECT 
                    p.id,
                    p.account_number,
                    p.payer,
                    sg.id AS service_group_id,
                    sg.name AS service_group,
                    s.id AS service_id,
                    s.name AS service_name,
                    s.unit,
                    p.quantity,
                    p.total_price,
                    p.status,
                    p.created_at,
                    p.updated_at
                FROM 
                    sport.payments p
                JOIN 
                    sport.services s ON p.service_id = s.id
                JOIN 
                    sport.service_groups sg ON s.service_group_id = sg.id
                WHERE 
                    p.id = $1
            `;
            const result = await sqlRequest(sql, [id]);
            return result[0];
        } catch (error) {
            logger.error("[SportsComplexRepository][getBillById]", error);
            throw error;
        }
    }

    async updateBillStatus(id, status) {
        try {
            const sql = `
                UPDATE payments
                SET status = $2, updated_at = CURRENT_TIMESTAMP
                WHERE id = $1
                RETURNING id
            `;
            const result = await sqlRequest(sql, [id, status]);
            return result[0];
        } catch (error) {
            logger.error("[SportsComplexRepository][updateBillStatus]", error);
            throw error;
        }
    }
}

module.exports = new SportsComplexRepository();