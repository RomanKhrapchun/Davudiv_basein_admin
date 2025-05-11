const sportsComplexController = require("../controller/sportscomplex-controller");
const {
    filterRequisitesSchema,
    filterPoolServicesSchema,
} = require("../schema/sportscomplex-schema");

async function sportsComplexRoutes(fastify, options) {
    fastify.post("/sportscomplex/filter-requisites", {
        schema: filterRequisitesSchema,
        handler: sportsComplexController.findRequisitesByFilter
    });

    fastify.post("/sportscomplex/filter-pool", {
        schema: filterPoolServicesSchema,
        handler: sportsComplexController.findPoolServicesByFilter
    });

    fastify.post("/sportscomplex/services", {
        handler: sportsComplexController.createPoolService
    });

    fastify.post("/sportscomplex/requisites", {
        handler: sportsComplexController.createRequisite
    });

    fastify.get("/sportscomplex/info/:id", sportsComplexController.getById);
    fastify.get("/sportscomplex/generate/:id", sportsComplexController.generateWordById);
    fastify.get("/sportscomplex/print/:id", sportsComplexController.printById);
}

module.exports = sportsComplexRoutes;
