const http = require('http');

// 测试函数
function testApi(options, name) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        console.log(`\n${name}接口状态码:`, res.statusCode);
        console.log(data);
        resolve({ statusCode: res.statusCode, data });
      });
    });

    req.on('error', (error) => {
      console.error(`${name}接口请求失败:`, error);
      reject(error);
    });

    req.end();
  });
}

// 测试所有接口
async function testAllApis() {
  console.log('开始测试所有接口...');

  try {
    // 测试健康检查接口
    await testApi(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/api/health',
        method: 'GET'
      },
      '健康检查'
    );

    // 测试首页Banner接口
    await testApi(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/mobile/banner/list',
        method: 'GET'
      },
      '首页Banner'
    );

    // 测试推荐酒店接口
    await testApi(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/mobile/home/recommended-hotels',
        method: 'GET'
      },
      '推荐酒店'
    );

    // 测试热门活动接口
    await testApi(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/mobile/home/hot-activities',
        method: 'GET'
      },
      '热门活动'
    );

    // 测试首页综合数据接口
    await testApi(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/mobile/home/data',
        method: 'GET'
      },
      '首页综合数据'
    );

    // 测试用户统计接口
    await testApi(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/mobile/user/stats',
        method: 'GET'
      },
      '用户统计'
    );

    // 测试支付方式接口
    await testApi(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/mobile/payment/methods',
        method: 'GET'
      },
      '支付方式'
    );

    // 测试用户定位接口
    await testApi(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/mobile/location/current',
        method: 'GET'
      },
      '用户定位'
    );

    // 测试酒店评价接口
    await testApi(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/mobile/reviews/hotel/1',
        method: 'GET'
      },
      '酒店评价'
    );

    // 测试酒店周边信息接口
    await testApi(
      {
        hostname: 'localhost',
        port: 3000,
        path: '/mobile/nearby/hotel/1',
        method: 'GET'
      },
      '酒店周边信息'
    );

    console.log('\n所有接口测试完成！');
  } catch (error) {
    console.error('测试过程中出现错误:', error);
  }
}

// 运行测试
testAllApis();