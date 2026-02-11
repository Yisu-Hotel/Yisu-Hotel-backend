const http = require('http');

// 测试健康检查接口
const healthCheckOptions = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/health',
  method: 'GET'
};

const healthCheckReq = http.request(healthCheckOptions, (res) => {
  console.log('健康检查接口状态码:', res.statusCode);
  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

healthCheckReq.on('error', (error) => {
  console.error('健康检查接口请求失败:', error);
});

healthCheckReq.end();

// 测试首页Banner接口
setTimeout(() => {
  const bannerOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/mobile/banner/list',
    method: 'GET'
  };

  const bannerReq = http.request(bannerOptions, (res) => {
    console.log('\n\n首页Banner接口状态码:', res.statusCode);
    res.on('data', (d) => {
      process.stdout.write(d);
    });
  });

  bannerReq.on('error', (error) => {
    console.error('首页Banner接口请求失败:', error);
  });

  bannerReq.end();
}, 1000);

// 测试推荐酒店接口
setTimeout(() => {
  const hotelOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/mobile/home/recommended-hotels',
    method: 'GET'
  };

  const hotelReq = http.request(hotelOptions, (res) => {
    console.log('\n\n推荐酒店接口状态码:', res.statusCode);
    res.on('data', (d) => {
      process.stdout.write(d);
    });
  });

  hotelReq.on('error', (error) => {
    console.error('推荐酒店接口请求失败:', error);
  });

  hotelReq.end();
}, 2000);