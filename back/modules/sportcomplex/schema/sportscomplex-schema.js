// Оновлений sportscomplex-schema.js

const getInfoSchema = {
    description: "Отримати реквізити груп послуг",
    tags: ["sportscomplex"],
    summary: "Реквізити",
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    group_name: { type: "string" },
                    kved: { type: "string" },
                    iban: { type: "string" },
                    edrpou: { type: "string" },
                },
            },
        },
    },
};

const getPoolServicesSchema = {
    description: "Отримати послуги басейну",
    tags: ["sportscomplex"],
    summary: "Послуги басейну",
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    name: { type: "string" },
                    unit: { type: "string" },
                    price: { type: "number" },
                    service_group_id: { type: "integer" },
                },
            },
        },
    },
};

const filterRequisitesSchema = {
    description: "Фільтрація реквізитів за параметрами",
    tags: ["sportscomplex"],
    body: {
        type: "object",
        properties: {
            page: { type: "integer" },
            limit: { type: "integer" },
            kved: { type: "string" },
            iban: { type: "string" },
            edrpou: { type: "string" },
        },
    },
};

const filterPoolServicesSchema = {
    description: "Фільтрація послуг басейну за параметрами",
    tags: ["sportscomplex"],
    body: {
        type: "object",
        properties: {
            page: { type: "integer" },
            limit: { type: "integer" },
            name: { type: "string" },
            unit: { type: "string" },
        },
    },
};

const getByIdSchema = {
    description: "Отримати реквізити за ID",
    tags: ["sportscomplex"],
    params: {
        type: "object",
        properties: {
            id: { type: "integer" }
        },
        required: ["id"]
    }
};

const generateSchema = getByIdSchema;
const printSchema = getByIdSchema;

module.exports = {
    getInfoSchema,
    getPoolServicesSchema,
    filterRequisitesSchema,
    filterPoolServicesSchema,
    getByIdSchema,
    generateSchema,
    printSchema
};
