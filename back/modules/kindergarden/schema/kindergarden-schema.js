
const kindergardenInfoSchema = {
    params: {
        id: {
            type: 'string',
            numeric: true,
        },
    }
}

const kindergardenFilterSchema = {
    body: {
        page: {
            type: 'number',
            optional: true,
        },
        title: {
            type: 'string',
            optional: true,
            min: 1,
        },
        identification: {
            type: 'string',
            optional: true,
            min: 1,
        },
    }
}

module.exports = {
    kindergardenFilterSchema,
    kindergardenInfoSchema,
}