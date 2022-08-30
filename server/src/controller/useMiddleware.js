const middy = require('@middy/core')
const httpEventNormalizer = require('@middy/http-event-normalizer')
const httpJsonBodyParser = require('@middy/http-json-body-parser')
const httpErrorHandler = require('@middy/http-error-handler')
const { Logger, injectLambdaContext } = require('@aws-lambda-powertools/logger')
const { Tracer, captureLambdaHandler } = require('@aws-lambda-powertools/tracer')

const tracer = new Tracer()
const logger = new Logger()

module.exports = {
    tracer: tracer,
    logger: logger
}

export default useMiddleware = (handler) => {
    let middlewaredHandler = middy(handler)
    middlewaredHandler.use(
        httpEventNormalizer(), 
        httpJsonBodyParser(), 
        httpErrorHandler(), 
        injectLambdaContext(logger),
        captureLambdaHandler(tracer)
    )
}