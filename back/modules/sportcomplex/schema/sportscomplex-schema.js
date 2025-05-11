// файл: back/modules/sportcomplex/schema/sportscomplex-schema.js

// Додамо схеми для нових ендпоінтів рахунків (bills)

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

// Нові схеми для функціоналу рахунків
const createPoolServiceSchema = {
    description: "Створення нової послуги басейну",
    tags: ["sportscomplex"],
    body: {
        type: "object",
        required: ["name", "unit", "price", "service_group_id"],
        properties: {
            name: { type: "string" },
            unit: { type: "string" },
            price: { type: "number" },
            service_group_id: { type: "integer" },
        },
    },
    response: {
        200: {
            type: "object",
            properties: {
                success: { type: "boolean" },
                message: { type: "string" },
            },
        },
    },
};

const createRequisiteSchema = {
    description: "Створення нових реквізитів",
    tags: ["sportscomplex"],
    body: {
        type: "object",
        required: ["kved", "iban", "edrpou", "service_group_id"],
        properties: {
            kved: { type: "string" },
            iban: { type: "string" },
            edrpou: { type: "string" },
            service_group_id: { type: "integer" },
        },
    },
    response: {
        200: {
            type: "object",
            properties: {
                success: { type: "boolean" },
                message: { type: "string" },
            },
        },
    },
};

// Схема для отримання груп послуг
const getServiceGroupsSchema = {
    description: "Отримати список груп послуг",
    tags: ["sportscomplex"],
    response: {
        200: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "integer" },
                    name: { type: "string" },
                }
            }
        }
    }
};

// Схема для отримання послуг за ID групи
const getServicesByGroupSchema = {
    description: "Отримати послуги для конкретної групи",
    tags: ["sportscomplex"],
    params: {
        type: "object",
        properties: {
            id: { type: "integer" }
        },
        required: ["id"]
    },
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
                }
            }
        }
    }
};

// Схема для створення нового рахунку
const createBillSchema = {
    description: "Створення нового рахунку",
    tags: ["sportscomplex"],
    body: {
        type: "object",
        required: ["account_number", "payer", "service_id", "quantity", "status"],
        properties: {
            account_number: { type: "string" },
            payer: { type: "string" },
            service_id: { type: "integer" },
            quantity: { type: "integer", minimum: 1 },
            status: { type: "string", enum: ["В процесі", "Оплачено", "Скасовано"] }
        }
    },
    response: {
        200: {
            type: "object",
            properties: {
                success: { type: "boolean" },
                message: { type: "string" },
                id: { type: "integer" }
            }
        }
    }
};

// Схема для фільтрації рахунків
const filterBillsSchema = {
    description: "Фільтрація рахунків за параметрами",
    tags: ["sportscomplex"],
    body: {
        type: "object",
        properties: {
            page: { type: "integer" },
            limit: { type: "integer" },
            account_number: { type: "string" },
            payer: { type: "string" },
            service_name: { type: "string" },
            status: { type: "string" },
        }
    }
};

// Схема для зміни статусу рахунку
const updateBillStatusSchema = {
    description: "Зміна статусу рахунку",
    tags: ["sportscomplex"],
    params: {
        type: "object",
        properties: {
            id: { type: "integer" }
        },
        required: ["id"]
    },
    body: {
        type: "object",
        required: ["status"],
        properties: {
            status: { type: "string", enum: ["В процесі", "Оплачено", "Скасовано"] }
        }
    },
    response: {
        200: {
            type: "object",
            properties: {
                success: { type: "boolean" },
                message: { type: "string" }
            }
        }
    }
};

// Схема для отримання квитанції
const getBillReceiptSchema = {
    description: "Отримання квитанції за рахунком",
    tags: ["sportscomplex"],
    params: {
        type: "object",
        properties: {
            id: { type: "integer" }
        },
        required: ["id"]
    },
    response: {
        200: {
            type: "string",
            format: "binary"
        }
    }
};

module.exports = {
    getInfoSchema,
    getPoolServicesSchema,
    filterRequisitesSchema,
    filterPoolServicesSchema,
    getByIdSchema,
    generateSchema,
    printSchema,
    createPoolServiceSchema,
    createRequisiteSchema,
    getServiceGroupsSchema,
    getServicesByGroupSchema,
    createBillSchema,
    filterBillsSchema,
    updateBillStatusSchema,
    getBillReceiptSchema
};