const axios = require('axios');

async function testHotelDetailAPI() {
  try {
    // 使用一个有效的酒店ID进行测试
    const hotelId = '80f9edf1-9a7a-4f29-8d43-8735ad83fa16';
    const response = await axios.get(`http://localhost:3001/mobile/hotel/${hotelId}`);
    
    console.log('API Response:', JSON.stringify(response.data, null, 2));
    console.log('\nTest completed successfully!');
  } catch (error) {
    console.error('Error testing API:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

testHotelDetailAPI();
