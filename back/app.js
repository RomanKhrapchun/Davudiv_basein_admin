const PORT = +(process.env.PORT || 5000);
const { parse: defaultParser } = require('fast-querystring')
const { sqlRequest } = require("./helpers/database");
const Logger = require('./utils/logger')
const userRoutes = require("./modules/user/router/user-router")
const authRoutes = require("./modules/auth/router/auth-router");
const accessGroupRoutes = require('./modules/access_group/router/accessGroups-router')
const logRoutes = require('./modules/log/router/log-router')
const moduleRoutes = require('./modules/module/router/module-router')
const uploadFiles = require('./modules/file/router/file-router')
const debtorRouter = require('./modules/debtor/router/debtor-router')
const sportsComplexRouter = require('./modules/sportscomplex/router/sportscomplex-router');
const validator = require('./helpers/validator')
const { allowedHeaders, exposedHeaders, cookieSettings } = require("./utils/constans");
const { rateLimitError, maxFileBytes } = require('./utils/messages')
const sessionStore = require('./utils/sessionStore');
const fastify = require("fastify")({ jsonShorthand: false, trustProxy: true, ignoreTrailingSlash: true });
fastify.decorate('user', null)
fastify.setValidatorCompiler(({ schema }) => {
    const compiledSchema = validator.compile(schema);
    return (data) => {
        const result = compiledSchema(data);
        if (result === true) {
            return {
                value: data,
            };
        } else {
            const errors = result;
            return {
                error: new Error(
                    errors[0].message || `Invalid field '${errors[0].field}'`
                ),
            };
        }
    };
});

fastify.register(require('@fastify/rate-limit'), {})
/*
fastify.addHook('preValidation', (request, reply, done) => {
    try {
      const contentLength = request.headers['content-length'];
      const maxFileSize = 20 * 1024 * 1024; 
  
      if (contentLength && Number(contentLength) > maxFileSize) {
        const error = new Error('Request Entity Too Large');
        error.statusCode = 413;
        throw error
      }
      done()
    } catch (error) {
      done(error)
    }
  });
  */

fastify.register(require('@fastify/multipart'), {
    attachFieldsToBody: true,
    limits: {
        fileSize: 20 * 1024 * 1024,
    },
});

fastify.register(require('@fastify/cookie'), {})
fastify.register(require('@fastify/cors'), {
    allowedHeaders: allowedHeaders,
    exposedHeaders: exposedHeaders,
    credentials: true,
    origin: ['http://localhost:3000', 'http://localhost:5173'],
})
fastify.addContentTypeParser('application/x-www-form-urlencoded', { parseAs: 'string' },
    function (req, body, done) {
        done(null, defaultParser(body.toString()))
    })
fastify.register(userRoutes, { prefix: "/api/users" });
fastify.register(authRoutes, { prefix: "/api/auth" });
fastify.register(accessGroupRoutes, { prefix: "/api/accessGroup" });
fastify.register(logRoutes, { prefix: "/api/log" });
fastify.register(moduleRoutes, { prefix: "/api/module" });
fastify.register(uploadFiles, { prefix: "/api/file" });
fastify.register(debtorRouter, { prefix: "/api/debtor" });
fastify.register(sportsComplexRouter, { prefix: '/api/sportscomplex' });

fastify.addHook("onSend", async (request, reply) => {
    if (request?.cookies?.['session'] && !request?.url?.includes('auth')) {
        await sessionStore.touch(request.cookies['session'])
        reply.cookie('session', request.cookies['session'], {
            maxAge: cookieSettings.maxAge,
            httpOnly: cookieSettings.httpOnly,
            sameSite: cookieSettings.sameSite,
            secure: cookieSettings.secure,
            path: "/"
        });
        return;
    }
    return;
})

fastify.setErrorHandler((err, request, reply) => {
    if (err?.statusCode === 413) {
        return reply.status(429).send({ error: true, message: maxFileBytes })
    }
    if (err?.statusCode === 429) {
        return reply.status(429).send({ error: true, message: rateLimitError })
    }
    return reply.status(400).send({ error: true, message: err.message })
});

const createServer = async () => {
    try {
        const result = await sqlRequest('SELECT 1+1')
        if (!result) throw "Помилка з'єднання з базою даних!"
        fastify.listen({ port: PORT, host: '0.0.0.0' }, () => {
            Logger.info(`Server listening on ${fastify.server.address().port}`, { info: fastify.server.address() });
        })
    } catch (error) {
        Logger.error(error);
        process.exit(1);
    }
}

module.exports = createServer