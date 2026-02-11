const request = require('supertest');
const app = require('../app');

describe('基础API测试', () => {
  // 测试健康检查API
  test('GET /api/health 应该返回健康状态', async () => {
    const response = await request(app).get('/api/health');
    expect(response.statusCode).toBe(200);
    expect(response.body.code).toBe(200);
    expect(response.body.msg).toBe('健康检查成功');
    expect(response.body.data).toHaveProperty('timestamp');
    expect(response.body.data).toHaveProperty('status');
    expect(response.body.data.status).toBe('healthy');
  });

  // 测试状态API
  test('GET /api/status 应该返回服务状态', async () => {
    const response = await request(app).get('/api/status');
    expect(response.statusCode).toBe(200);
    expect(response.body.code).toBe(200);
    expect(response.body.msg).toBe('Express后端服务启动成功！');
    expect(response.body.data).toBeNull();
  });

  // 测试测试API
  test('GET /api/test 应该返回测试信息', async () => {
    const response = await request(app).get('/api/test');
    expect(response.statusCode).toBe(200);
    expect(response.body.code).toBe(200);
    expect(response.body.msg).toBe('前后端连通性测试成功');
    expect(response.body.data).toHaveProperty('timestamp');
    expect(response.body.data).toHaveProperty('method');
    expect(response.body.data).toHaveProperty('path');
    expect(response.body.data.method).toBe('GET');
    expect(response.body.data.path).toBe('/api/test');
  });

  // 测试根路径
  test('GET / 应该返回服务信息', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.body.code).toBe(200);
    expect(response.body.msg).toBe('易宿酒店预订平台后端服务');
    expect(response.body.data).toHaveProperty('timestamp');
    expect(response.body.data).toHaveProperty('version');
    expect(response.body.data).toHaveProperty('endpoints');
    expect(response.body.data.version).toBe('1.0.0');
  });

  // 测试监控API
  test('GET /api/monitoring 应该返回监控统计信息', async () => {
    const response = await request(app).get('/api/monitoring');
    expect(response.statusCode).toBe(200);
    expect(response.body.code).toBe(200);
    expect(response.body.msg).toBe('获取监控统计信息成功');
    expect(response.body.data).toHaveProperty('requestCount');
    expect(response.body.data).toHaveProperty('errorCount');
    expect(response.body.data).toHaveProperty('avgResponseTime');
    expect(response.body.data).toHaveProperty('lastReset');
    expect(response.body.data).toHaveProperty('currentTime');
    expect(response.body.data).toHaveProperty('uptime');
  });

  // 测试重置监控统计信息API
  test('POST /api/monitoring/reset 应该重置监控统计信息', async () => {
    const response = await request(app).post('/api/monitoring/reset');
    expect(response.statusCode).toBe(200);
    expect(response.body.code).toBe(200);
    expect(response.body.msg).toBe('重置监控统计信息成功');
    expect(response.body.data).toHaveProperty('requestCount');
    expect(response.body.data).toHaveProperty('errorCount');
    expect(response.body.data).toHaveProperty('avgResponseTime');
    expect(response.body.data).toHaveProperty('lastReset');
    expect(response.body.data.requestCount).toBe(0);
    expect(response.body.data.errorCount).toBe(0);
    expect(response.body.data.avgResponseTime).toBe(0);
  });

  // 测试404错误
  test('GET /nonexistent 应该返回404错误', async () => {
    const response = await request(app).get('/nonexistent');
    expect(response.statusCode).toBe(404);
  });
});
