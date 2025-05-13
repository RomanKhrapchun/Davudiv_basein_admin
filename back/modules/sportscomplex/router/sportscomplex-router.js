const sportsComplexController = require("../controller/sportscomplex-controller");
const {
    filterRequisitesSchema,
    filterPoolServicesSchema,
    filterBillsSchema,
} = require("../schema/sportscomplex-schema");

async function sportsComplexRoutes(fastify, options) {
    fastify.post("/filter-requisites", {
        schema: filterRequisitesSchema,
        handler: sportsComplexController.findRequisitesByFilter
    });

    fastify.post("/filter-pool", {
        schema: filterPoolServicesSchema,
        handler: sportsComplexController.findPoolServicesByFilter
    });

    fastify.post("/services", {
        handler: sportsComplexController.createPoolService
    });

    fastify.post("/requisites", {
        handler: sportsComplexController.createRequisite
    });

    fastify.post("/bills/filter", {
        schema: filterBillsSchema,
        handler: sportsComplexController.findBillsByFilter
    });

    fastify.get("/bills/:id", sportsComplexController.getBillById);
    fastify.post("/bills", sportsComplexController.createBill);
    fastify.put("/bills/:id/status", sportsComplexController.updateBillStatus);
    fastify.get("/bills/:id/receipt", sportsComplexController.generateBillReceipt);

    fastify.get("/info/:id", sportsComplexController.getById);
    fastify.get("/generate/:id", sportsComplexController.generateWordById);
    fastify.get("/print/:id", sportsComplexController.printById);
}

module.exports = sportsComplexRoutes;
