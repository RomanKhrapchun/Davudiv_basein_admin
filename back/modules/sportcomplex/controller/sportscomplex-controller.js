const sportsComplexService = require("../service/sportscomplex-service");
const logger = require("../../../utils/logger");

class SportsComplexController {
    async findRequisitesByFilter(request, reply) {
        try {
            const data = await sportsComplexService.findRequisitesByFilter(request);
            return reply.send(data);
        } catch (error) {
            logger.error("[findRequisitesByFilter]", error);
            return reply.code(500).send({ error: "Не вдалося застосувати фільтр до реквізитів." });
        }
    }

    async findPoolServicesByFilter(request, reply) {
        try {
            const data = await sportsComplexService.findPoolServicesByFilter(request);
            return reply.send(data);
        } catch (error) {
            logger.error("[findPoolServicesByFilter]", error);
            return reply.code(500).send({ error: "Не вдалося застосувати фільтр до послуг басейну." });
        }
    }

    async getById(request, reply) {
        try {
            const data = await sportsComplexService.getById(request.params.id);
            return reply.send(data);
        } catch (error) {
            logger.error("[getById]", error);
            return reply.code(500).send({ error: "Не вдалося отримати дані." });
        }
    }

    async generateWordById(request, reply) {
        try {
            const docxBuffer = await sportsComplexService.generateWordById(request.params.id);
            reply.header("Content-Disposition", `attachment; filename=generated.docx`);
            reply.type("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
            return reply.send(docxBuffer);
        } catch (error) {
            logger.error("[generateWordById]", error);
            return reply.code(500).send({ error: "Помилка генерації документа." });
        }
    }

    async printById(request, reply) {
        try {
            const data = await sportsComplexService.printById(request.params.id);
            return reply.send(data);
        } catch (error) {
            logger.error("[printById]", error);
            return reply.code(500).send({ error: "Не вдалося отримати дані для друку." });
        }
    }
}

module.exports = new SportsComplexController();