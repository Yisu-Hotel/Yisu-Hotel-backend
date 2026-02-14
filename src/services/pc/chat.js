const https = require('https');
const { URL } = require('url');

const requestBigModel = (apiKey, payload) => new Promise((resolve, reject) => {
  const url = new URL('https://open.bigmodel.cn/api/paas/v4/chat/completions');
  const request = https.request(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    }
  }, (response) => {
    let rawData = '';
    response.on('data', (chunk) => {
      rawData += chunk;
    });
    response.on('end', () => {
      let data;
      try {
        data = rawData ? JSON.parse(rawData) : {};
      } catch (error) {
        const parseError = new Error('AI服务响应解析失败');
        parseError.code = 5001;
        parseError.httpStatus = 502;
        return reject(parseError);
      }
      if (response.statusCode < 200 || response.statusCode >= 300) {
        const serviceError = new Error(data?.msg || data?.error?.message || 'AI服务异常');
        serviceError.code = 5001;
        serviceError.httpStatus = response.statusCode;
        serviceError.response = data;
        return reject(serviceError);
      }
      return resolve(data);
    });
  });

  request.on('error', (error) => {
    const serviceError = new Error(error?.message || 'AI服务异常');
    serviceError.code = 5001;
    serviceError.httpStatus = 502;
    reject(serviceError);
  });

  request.write(JSON.stringify(payload));
  request.end();
});

const createChatCompletionService = async ({ messages }) => {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) {
    const error = new Error('AI服务未配置');
    error.code = 5001;
    error.httpStatus = 500;
    throw error;
  }

  const payload = {
    model: 'glm-5',
    messages,
    thinking: {
      type: 'disabled'
    },
    max_tokens: 65536,
    temperature: 1.0
  };

  const response = await requestBigModel(apiKey, payload);
  return {
    message: response?.choices?.[0]?.message || null,
    usage: response?.usage || null,
    request_id: response?.request_id || null
  };
};

module.exports = {
  createChatCompletionService
};
