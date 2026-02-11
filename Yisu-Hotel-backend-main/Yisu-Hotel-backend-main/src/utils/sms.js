require('dotenv').config();

const Dypnsapi20170525 = require('@alicloud/dypnsapi20170525');
const OpenApi = require('@alicloud/openapi-client');
const Util = require('@alicloud/tea-util');
const Credential = require('@alicloud/credentials');

class AliyunSMS {
  static createClient() {
    const credential = new Credential.default({
      type: 'access_key',
      accessKeyId: process.env.accessKeyId,
      accessKeySecret: process.env.accessKeySecret
    });

    const config = new OpenApi.Config({
      credential: credential,
    });

    config.endpoint = 'dypnsapi.aliyuncs.com';
    return new Dypnsapi20170525.default(config);
  }

  static async sendVerifyCode(phoneNumber, code) {
    const client = this.createClient();
    const request = new Dypnsapi20170525.SendSmsVerifyCodeRequest({
      signName: '速通互联验证码',
      templateCode: '100001',
      templateParam: JSON.stringify({ code: code, min: '5' }),
      phoneNumber: phoneNumber,
    });

    const runtime = new Util.RuntimeOptions({});

    try {
      const resp = await client.sendSmsVerifyCodeWithOptions(request, runtime);
      return resp.body;
    } catch (error) {
      console.error('短信发送失败:', error.message);
      throw error;
    }
  }
}

module.exports = AliyunSMS;
