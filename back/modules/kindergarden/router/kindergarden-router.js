const { RouterGuard } = require('../../../helpers/Guard');
const { accessLevel } = require('../../../utils/constans');
const { viewLimit } = require('../../../utils/ratelimit');
const kindergardenController = require('../controller/kindergarden-controller');
const { kindergardenFilterSchema, kindergardenInfoSchema } = require('../schema/kindergarden-schema');

const routes = async (fastify) => {
    fastify.post("/filter", { schema: kindergardenFilterSchema, preParsing: RouterGuard({ permissionLevel: "debtor", permissions: accessLevel.VIEW }) }, kindergardenController.findDebtByFilter);
    fastify.get("/info/:id", { schema: kindergardenInfoSchema, preParsing: RouterGuard({ permissionLevel: "debtor", permissions: accessLevel.VIEW }), config: viewLimit }, kindergardenController.getDebtByDebtorId);
    fastify.get("/generate/:id", { schema: kindergardenInfoSchema, preParsing: RouterGuard({ permissionLevel: "debtor", permissions: accessLevel.VIEW }) }, kindergardenController.generateWordByDebtId);
    fastify.get("/print/:id", { schema: kindergardenInfoSchema, preParsing: RouterGuard({ permissionLevel: "debtor", permissions: accessLevel.VIEW }) }, kindergardenController.printDebtId);
}

module.exports = routes;