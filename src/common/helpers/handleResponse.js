const env = process.env.NODE_ENV || 'development';
const _ = require('underscore');
const logger = require('../../common/helpers/logger');
const codes = require('../../common/helpers/codes');

const parseObject = (obj, tabspace) => {
  tabspace || (tabspace = 1);
  return (
    _.reduce(
      obj,
      (memo, value, key) => {
        if (_.isObject(value)) {
          value = parseObject(value, tabspace + 1);
        }

        if (_.isString(value)) {
          value = value.replace(
            /(?:\r\n|\r|\n)/g,
            '\n' + '  '.repeat(tabspace + 1)
          );
        }

        memo.string += `${' '.repeat(tabspace) + key}: ${value}\n`;

        return memo;
      },
      { string: '{\n', tabspace }
    ).string + '}'
  );
};

const formatError = (error) => {
  const message = codes[error.message]
    ? error.message
    : 'Internal Server Error';

  const { code, description } = codes[message];

  const formatted = {
    message,
    statusCode: code,
    description: error.description ? error.description : description,
    details: description,
  };

  if (env !== 'production') {
    error.path && (formatted.path = error.path);
    error.details && (formatted.details = error.details.stack);
    error.path || (formatted.details = error.stack);
  }

  return formatted;
};

const formatSuccess = (data) => {
  const message = codes[data.message] ? data.message : 'OK';

  const { code, description } = codes[message];
  const outPut = data.outPut;

  const formatted = {
    message,
    statusCode: code,
    description: data.description ? data.description : description,
    outPut: outPut ? outPut : null,
  };

  return formatted;
};

const handleResponse = {
  error: (data, res = null) => {
    const response = formatError(data);

    logger.error(parseObject(response, null, 2));

    if (res) return res.status(response.statusCode || 500).send(response);

    return response;
  },
  success: (data, res) => {
    const response = formatSuccess(data);

    if (res) return res.status(response.statusCode || 200).send(response);

    return response;
  },
};

module.exports = handleResponse;
