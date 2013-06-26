/**
 * Default messages on our API
 */
var MESSAGES = {
  /**
   * Title property on links object
   */
  titles: {
    resourceInformation: 'Get the <%= type %> informations.',
    visibleResource: 'Get the <%= type %> which are visible',
    invisibleResource: 'Get the <%= type %> which are invisible',
    whereAreResources: 'Find where are the <%= type %> which are returned in this response',
    howAreResources: 'Know how are the tags which are returned in this response',

    pagination: {
      self: 'The current request for <%= type %>',
      first: 'First page of <%= type %>',
      prev: 'Previous page of <%= type %>',
      next: 'Next page of <%= type %>',
      last: 'Last page of <%= type %>'
    },

    ressourceNotFound: 'No <%= type %>  with <%= idType %> = <%= id %> found',
  },

  /**
   * Specific errors messages
   */
  errors: {
    databaseRequest: 'Error on database request (<%= type %>): <%= err %>',
    missingRequiredParam: 'Missing required parameter : <%= paramName %>',
    invalidParam: '<%= paramName %> parameter has a bad formatting',

    portAlreadyUse: '- The port <%= port %> is already in use.',
    uncaughtException: 'Error: Uncaught exception. Message: <%= err %>',

    dbConnection: '- Cannot connect with the database.\n' +
                  '    First, check that it\'s up and running.\n' +
                  '    Then, check your configuration file.\n'
  },

  /**
   * Internal messages (i.e. logs, launching, ..)
   */
  internal: {
     initialization: '\n# Initialization',
     confValidation: '\n## Validation of the configuration file',
     confInvalid: '- Configuration file is not valid.',
     confValid: '- Configuration file is valid.',
     dbConnection: '\n## Database connection',
     dbConnected: '- Connection with the database: OK',
     serverStarting: '\n## Starting the server',
     serverReady: '-  <%= name %> is ready and waiting for your orders at <%= url %>',
     exiting: '\n## Proccess exiting',
     dbDisconnected: '- Database disconnected'
  },

  /**
   * Default response object values
   */
  response: {
    ok: {
      message: 'ok',
      developerMessage: 'ok',
      userMessage: 'Everything is ok',
      moreInfo: 'Documentation is not implemented yet'
    },

    badRequest: {
      message: 'badRequest',
      developerMessage: 'badRequest',
      userMessage: 'An error occured due to a missing information',
      moreInfo: 'Documentation is not implemented yet'
    },

    notFound: {
      message: 'notFound',
      developerMessage: 'notFound',
      userMessage: 'Ressource not found',
      moreInfo: 'Documentation is not implemented yet'
    },

    notAcceptable: {
      message: 'notAcceptable',
      developerMessage: 'notAcceptable',
      userMessage: 'This action isn\'t supported by the server',
      moreInfo: 'Documentation is not implemented yet'
    },

    internalServerError: {
      message: 'internalServerError',
      developerMessage: 'internalServerError',
      userMessage: 'An error occured on our side.',
      moreInfo: 'Documentation is not implemented yet'
    },

    notImplemented: {
      message: 'notImplemented',
      developerMessage: 'notImplemented',
      userMessage: 'The action you\'ve tried isn\'t yet implemented.',
      moreInfo: 'Documentation is not implemented yet'
    }
  },

  /**
   * Entry point
   */
  entry: {
    versionNotFound: 'The version you request, doesn\'t exist.',
    notFoundPage: 'Why did you request the 404 ? ' +
                  'Now, you\'re lost.. And so am I.'
  },

  /**
   * Tag resource
   */
  tag: {
    locationPoi: 'Point of interest where this tag is located',
    previousLocationPoi: 'Previous point of interest where this tag was located',
    reelceiverDecoding: 'One of the reelceiver which decoded this tag',
    self: 'The tag himself',
    tags: 'The tags resource. Return all the tags you have access to',
    poiLocated: 'Point of interest where this tag is located',
    howIsPoi: 'Know how is the point of interest where this tag is located',
    whatAtPoi: 'Find what at the point of interest where this tag is located',
    previousPoiLocated: 'Previous point of interest where this tag was located',
    howIsPrevPoi: 'Know how is the previous point of interest where this tag was located',
    whatAtPrevPoi: 'Find what at the previous point of interest where this tag was located',
    howAreDecodingReelceivers: 'Know how are the reelceivers which decoded this tag',
    whatAtDecodingReelceivers: 'Find what is located at the reelceivers which decoded this tag'
  }
};

module.exports = MESSAGES;