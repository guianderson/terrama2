'use strict';

/**
 * This file contains TerraMA2 common exceptions
 * @class Errors
*/
var util = require('util');
var errors = module.exports = {};


/**
 * The Base Error all TerraMA2 Errors inherit from.
 * @class BaseError
 * @param {string} message - An error message
*/
errors.BaseError = function(message) {
  Error.apply(this, arguments);

  this.name = this.name = 'BaseError';
  this.message = message;

  Error.captureStackTrace(this, this.constructor);
};
util.inherits(errors.BaseError, Error);


/**
 * Thrown when DataManager class has failed during either database connection or database operation
 *
 * @param {string} message Error message
 *
 * @extends BaseError
*/
errors.DataManagerError = function(message) {
  errors.BaseError.apply(this, arguments);
  this.name = 'DataManagerError';
};
util.inherits(errors.DataManagerError, errors.BaseError);


errors.ValidationError = function(message, errs) {
  errors.BaseError.apply(this, arguments);
  this.name = 'ValidationError';

  this.errors = errs || [];
  if (message) {
    this.message = message;
  } else if (this.errors.length > 0 && this.errors[0].message) {
    this.message = this.errors.map(function(err){
      return err.type + ": " + err.message;
    }).join(',\n');
  }

  this.getErrors = function() {
    var output = {};
    this.errors.forEach(function(err) {
      output[err.path] = err.message;
    });
    return output;
  };
};

util.inherits(errors.ValidationError, errors.BaseError);


/**
 * Thrown when DataProvider object has inconsistent data.
 *
 * @param {string} message Error message
 * @param {Array<Error>} errs - An array of errors message
 *
 * @extends ValidationError
 */
errors.DataProviderError = function(message, errs) {
  errors.ValidationError.apply(this, arguments);
  this.name = 'DataProviderError';
};
util.inherits(errors.DataProviderError, errors.ValidationError);


/**
 * Thrown when DataSeries object has inconsistent data.
 *
 * @param {string} message Error message
 * @param {Array<Error>} errs - An array of errors message
 *
 * @extends ValidationError
 */
errors.DataSeriesError = function(message, errs) {
  errors.ValidationError.apply(this, arguments);
  this.name = 'DataSeriesError';
};
util.inherits(errors.DataSeriesError, errors.ValidationError);


/**
 * Thrown when DataSet object has inconsistent data.
 *
 * @param {string} message Error message
 * @param {Array<Error>} errs - An array of errors message
 *
 * @extends ValidationError
 */
errors.DataSetError = function(message, errs) {
  errors.ValidationError.apply(this, arguments);
  this.name = 'DataSetError';
};
util.inherits(errors.DataSetError, errors.ValidationError);


/**
 * Thrown when Service object has inconsistent data.
 *
 * @param {string} message Error message
 * @param {Array<Error>} errs - An array of errors message
 *
 * @extends ValidationError
 */
errors.ServiceError = function(message, errs) {
  errors.ValidationError.apply(this, arguments);
  this.name = 'ServiceError';
};
util.inherits(errors.ServiceError, errors.ValidationError);


/**
 * Thrown when Project object has inconsistent data.
 *
 * @param {string} message Error message
 *
 * @extends ValidationError
 */
errors.ProjectError = function(message, errs) {
  errors.ValidationError.apply(this, arguments);
  this.name = 'ProjectError';
};
util.inherits(errors.ProjectError, errors.ValidationError);

/**
 * Thrown when User object has inconsistent data.
 *
 * @param {string} message Error message
 * @param {Array<Error>} errs - An array of errors message
 *
 * @extends ValidationError
 */
errors.UserError = function(message, errs) {
  errors.ValidationError.apply(this, arguments);
  this.name = 'UserError';
};
util.inherits(errors.UserError, errors.ValidationError);


/**
 * Thrown when DataSeriesSemanticsError object has inconsistent data.
 *
 * @param {string} message Error message
 * @param {Array<Error>} errs - An array of errors message
 *
 * @extends ValidationError
 */
errors.DataSeriesSemanticsError = function(message, errs) {
  errors.ValidationError.apply(this, arguments);
  this.name = 'DataSeriesSemanticsError';
};
util.inherits(errors.DataSeriesSemanticsError, errors.ValidationError);


/**
 * Thrown when DataFormatError object has inconsistent data.
 *
 * @param {string} message Error message
 * @param {Array<Error>} errs - An array of errors message
 *
 * @extends ValidationError
 */
errors.DataFormatError = function(message, errs) {
  errors.ValidationError.apply(this, arguments);
  this.name = 'DataFormatError';
};
util.inherits(errors.DataFormatError, errors.ValidationError);


/**
 * Thrown when check connection has failed.
 *
 * @param {string} message Error message
 *
 * @extends BaseError
 */
errors.ConnectionError = function(message) {
  errors.BaseError.apply(this, arguments);
  this.name = 'ConnectionError';
};
util.inherits(errors.ConnectionError, errors.BaseError);


/**
 * Thrown when URI ill-formed.
 *
 * @param {string} message Error message
 *
 * @extends BaseError
 */
errors.UriError = function(message) {
  errors.BaseError.apply(this, arguments);
  this.name = 'UriError';
};
util.inherits(errors.UriError, errors.BaseError);


/**
 * Thrown when could not load Plugin.
 *
 * @param {string} message Error message
 *
 * @extends BaseError
 */
errors.PluginError = function(message) {
  errors.BaseError.apply(this, arguments);
  this.name = 'PluginError';
};
util.inherits(errors.PluginError, errors.BaseError);


/**
 * Thrown when Schedule object has inconsistent data.
 *
 * @param {string} message Error message
 *
 * @extends BaseError
 */
errors.ScheduleError = function(message) {
  errors.BaseError.apply(this, arguments);
  this.name = 'ScheduleError';
};
util.inherits(errors.ScheduleError, errors.BaseError);


/**
 * Thrown when Collector object has inconsistent data.
 *
 * @param {string} message Error message
 *
 * @extends BaseError
 */
errors.CollectorError = function(message) {
  errors.BaseError.apply(this, arguments);
  this.name = 'CollectorError';
};
util.inherits(errors.CollectorError, errors.BaseError);


/**
 * Thrown when Filter object has inconsistent data.
 *
 * @param {string} message Error message
 *
 * @extends BaseError
 */
errors.FilterError = function(message) {
  errors.BaseError.apply(this, arguments);
  this.name = 'FilterError';
};
util.inherits(errors.FilterError, errors.BaseError);


/**
 * Thrown when Analysis object has inconsistent data.
 *
 * @param {string} message Error message
 *
 * @extends BaseError
 */
errors.AnalysisError = function(message) {
  errors.BaseError.apply(this, arguments);
  this.name = 'AnalysisError';
};
util.inherits(errors.AnalysisError, errors.BaseError);


/**
 * Thrown when Signal is invalid.
 *
 * @param {string} message Error message
 *
 * @extends BaseError
 */
errors.SignalError = function(message) {
  errors.BaseError.apply(this, arguments);
  this.name = 'SignalError';
};
util.inherits(errors.SignalError, errors.BaseError);


/**
 * Thrown when Service Type is invalid.
 *
 * @param {string} message Error message
 *
 * @extends BaseError
 */
errors.ServiceTypeError = function(message) {
  errors.BaseError.apply(this, arguments);
  this.name = 'ServiceTypeError';
};
util.inherits(errors.ServiceTypeError, errors.BaseError);
