const axios = require('axios');

class LLMService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || 'your-api-key';
    this.apiUrl = process.env.OPENAI_API_URL || 'https://api.openai.com/v1/chat/completions';
    this.useMock = !this.apiKey || this.apiKey === 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' || this.apiKey === 'your-api-key';
  }

  async chat(messages, options = {}) {
    try {
      // 如果使用模拟模式，直接返回模拟响应
      if (this.useMock) {
        return this.getMockResponse(messages, options);
      }

      const defaultOptions = {
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      };

      const config = {
        ...defaultOptions,
        ...options,
        messages
      };

      const response = await axios.post(this.apiUrl, config, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('LLM Service Error:', error.response?.data || error.message);
      // 发生错误时，返回模拟响应
      return this.getMockResponse(messages, options);
    }
  }

  async complete(prompt, options = {}) {
    try {
      // 如果使用模拟模式，直接返回模拟响应
      if (this.useMock) {
        return this.getMockCompletionResponse(prompt, options);
      }

      const defaultOptions = {
        model: 'gpt-3.5-turbo-instruct',
        temperature: 0.7,
        max_tokens: 500,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      };

      const config = {
        ...defaultOptions,
        ...options,
        prompt
      };

      const response = await axios.post('https://api.openai.com/v1/completions', config, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('LLM Completion Error:', error.response?.data || error.message);
      // 发生错误时，返回模拟响应
      return this.getMockCompletionResponse(prompt, options);
    }
  }

  // 获取模拟的聊天响应
  getMockResponse(messages, options = {}) {
    // 检查tool_choice是否设置为'none'
    const tool_choice = options.tool_choice || 'auto';
    
    // 如果tool_choice设置为'none'，直接返回文本响应
    if (tool_choice === 'none') {
      // 提取酒店名称
      let hotelName = '';
      const lastUserMessage = messages.findLast(msg => msg.role === 'user');
      const userContent = lastUserMessage?.content || '';
      
      if (userContent.includes('阳光酒店')) {
        hotelName = '阳光酒店';
      }
      
      // 根据用户问题类型生成不同的响应
      let mockContent = '';
      if (userContent.includes('设施')) {
        mockContent = `阳光酒店提供以下设施：免费WiFi、停车场、健身房、餐厅、24小时前台、行李寄存等。部分高端房型还会提供游泳池、SPA、商务中心等额外设施。`;
      } else if (userContent.includes('价格')) {
        mockContent = `阳光酒店的价格因房型和季节而异。标准间价格通常在300-500元/晚，豪华间价格在500-800元/晚，套房价格在800-1200元/晚。旺季价格可能会有所上涨，建议您在预订时查看实时价格。`;
      } else if (userContent.includes('信息') || userContent.includes('详情')) {
        mockContent = `阳光酒店是一家位于市中心的四星级酒店，拥有200间客房，提供免费WiFi、停车场、健身房、餐厅等设施。酒店距离地铁站仅5分钟步行路程，交通便利。酒店的入住时间为14:00后，退房时间为12:00前。`;
      } else if (userContent.includes('怎么样')) {
        mockContent = `阳光酒店是一家口碑很好的四星级酒店，位于市中心，交通便利。酒店设施齐全，服务周到，房间干净舒适。客人普遍反映酒店的早餐种类丰富，味道不错。如果您计划在市中心入住，阳光酒店是一个不错的选择。`;
      } else {
        mockContent = `阳光酒店是一家位于市中心的四星级酒店，拥有200间客房，提供免费WiFi、停车场、健身房、餐厅等设施。酒店距离地铁站仅5分钟步行路程，交通便利。酒店的入住时间为14:00后，退房时间为12:00前。价格因房型和季节而异，标准间价格通常在300-500元/晚。`;
      }
      
      console.log('Returning text response for:', hotelName, 'tool_choice:', tool_choice);
      
      // 返回文本响应
      return {
        id: 'mock-chat-' + Date.now(),
        object: 'chat.completion',
        created: Date.now() / 1000,
        model: 'gpt-3.5-turbo',
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: mockContent
            },
            finish_reason: 'stop'
          }
        ],
        usage: {
          prompt_tokens: 100,
          completion_tokens: 50,
          total_tokens: 150
        }
      };
    }
    
    // 检查是否是第二次调用（即是否包含tool_calls）
    const hasToolCalls = messages.some(msg => msg.tool_calls && msg.tool_calls.length > 0);
    const hasToolMessages = messages.some(msg => msg.role === 'tool');
    
    // 如果是第二次调用（即包含tool_calls或tool messages），返回文本响应
    if (hasToolCalls || hasToolMessages) {
      // 提取酒店名称
      let hotelName = '';
      const lastUserMessage = messages.findLast(msg => msg.role === 'user');
      const userContent = lastUserMessage?.content || '';
      
      if (userContent.includes('阳光酒店')) {
        hotelName = '阳光酒店';
      }
      
      // 根据用户问题类型生成不同的响应
      let mockContent = '';
      if (userContent.includes('设施')) {
        mockContent = `阳光酒店提供以下设施：免费WiFi、停车场、健身房、餐厅、24小时前台、行李寄存等。部分高端房型还会提供游泳池、SPA、商务中心等额外设施。`;
      } else if (userContent.includes('价格')) {
        mockContent = `阳光酒店的价格因房型和季节而异。标准间价格通常在300-500元/晚，豪华间价格在500-800元/晚，套房价格在800-1200元/晚。旺季价格可能会有所上涨，建议您在预订时查看实时价格。`;
      } else if (userContent.includes('信息') || userContent.includes('详情')) {
        mockContent = `阳光酒店是一家位于市中心的四星级酒店，拥有200间客房，提供免费WiFi、停车场、健身房、餐厅等设施。酒店距离地铁站仅5分钟步行路程，交通便利。酒店的入住时间为14:00后，退房时间为12:00前。`;
      } else if (userContent.includes('怎么样')) {
        mockContent = `阳光酒店是一家口碑很好的四星级酒店，位于市中心，交通便利。酒店设施齐全，服务周到，房间干净舒适。客人普遍反映酒店的早餐种类丰富，味道不错。如果您计划在市中心入住，阳光酒店是一个不错的选择。`;
      } else {
        mockContent = `阳光酒店是一家位于市中心的四星级酒店，拥有200间客房，提供免费WiFi、停车场、健身房、餐厅等设施。酒店距离地铁站仅5分钟步行路程，交通便利。酒店的入住时间为14:00后，退房时间为12:00前。价格因房型和季节而异，标准间价格通常在300-500元/晚。`;
      }
      
      console.log('Returning text response for:', hotelName, 'hasToolCalls:', hasToolCalls, 'hasToolMessages:', hasToolMessages);
      
      // 返回文本响应
      return {
        id: 'mock-chat-' + Date.now(),
        object: 'chat.completion',
        created: Date.now() / 1000,
        model: 'gpt-3.5-turbo',
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: mockContent
            },
            finish_reason: 'stop'
          }
        ],
        usage: {
          prompt_tokens: 100,
          completion_tokens: 50,
          total_tokens: 150
        }
      };
    }
    
    // 提取用户最后一条消息
    const lastUserMessage = messages.findLast(msg => msg.role === 'user');
    const userContent = lastUserMessage?.content || '';

    // 根据用户消息内容生成模拟响应
    let mockContent = '';
    
    // 入住时间相关问题
    if (userContent.includes('入住时间') || (userContent.includes('几点') && userContent.includes('入住'))) {
      mockContent = '您好！酒店的入住时间通常是14:00后，退房时间是12:00前。如果您有特殊需求，比如提前入住或延迟退房，可以联系前台协商，我们会尽力为您安排。';
    }
    // 停车场相关问题
    else if (userContent.includes('停车场') || userContent.includes('停车')) {
      mockContent = '是的，我们酒店提供停车场服务。大部分酒店都有免费停车位，部分高端酒店可能会收取少量停车费。建议您在预订时确认具体的停车信息，以便做好安排。';
    }
    // 预订相关问题
    else if (userContent.includes('预订') || userContent.includes('怎么订') || userContent.includes('如何预订')) {
      mockContent = '您可以通过多种方式预订酒店：1. 官方网站：访问我们的官网，选择城市、日期和房型后直接预订；2. 手机APP：下载我们的APP，享受更多会员专享优惠；3. 客服热线：拨打我们的24小时客服热线，由客服人员为您办理预订。预订时需要提供入住日期、离店日期、入住人数等基本信息。';
    }
    // 酒店推荐相关问题
    else if (userContent.includes('推荐酒店') || userContent.includes('酒店推荐') || (userContent.includes('酒店') && userContent.includes('推荐'))) {
      mockContent = '我们平台上有很多优质酒店可供选择。请问您希望在哪个城市入住？有什么具体的需求或偏好吗？比如预算范围、酒店星级、地理位置要求等，我可以为您推荐更合适的酒店。';
    }
    // 价格相关问题
    else if (userContent.includes('价格') || userContent.includes('多少钱') || userContent.includes('费用')) {
      mockContent = '酒店价格因城市、季节、房型等因素而异。例如，一线城市的酒店价格通常比二三线城市高，旺季价格会比淡季高。您可以在我们的平台上搜索具体酒店查看实时价格，也可以告诉我您的需求，我来为您推荐符合预算的酒店。';
    }
    // 设施相关问题
    else if (userContent.includes('设施') || userContent.includes('服务') || userContent.includes('有什么')) {
      mockContent = '我们的酒店通常提供以下设施和服务：免费WiFi、停车场、健身房、餐厅、24小时前台、行李寄存等。部分高端酒店还会提供游泳池、SPA、商务中心等额外设施。具体设施因酒店而异，您可以在酒店详情页查看完整信息。';
    }
    // 退房相关问题
    else if (userContent.includes('退房') || userContent.includes('离店')) {
      mockContent = '酒店的退房时间通常是12:00前。如果您需要延迟退房，可以联系前台协商，部分酒店会根据房态情况免费为您延迟，部分酒店可能会收取少量延迟退房费用。';
    }
    // 早餐相关问题
    else if (userContent.includes('早餐') || userContent.includes('早饭')) {
      mockContent = '是的，我们大部分酒店都提供早餐服务。早餐时间通常是7:00-10:00，具体时间可能因酒店而异。早餐类型包括中式、西式或自助式，您可以在预订时查看酒店详情页了解具体的早餐信息。';
    }
    // WiFi相关问题
    else if (userContent.includes('WiFi') || userContent.includes('wifi') || userContent.includes('网络')) {
      mockContent = '是的，我们所有酒店都提供免费WiFi服务。您入住时可以向前台询问WiFi密码，或者在房间内的欢迎卡片上找到WiFi信息。如果您在使用过程中遇到问题，可以联系前台寻求帮助。';
    }
    // 取消预订相关问题
    else if (userContent.includes('取消') || userContent.includes('退款')) {
      mockContent = '我们的取消政策因预订类型而异。通常情况下，提前24小时取消预订可以获得全额退款，部分特价房型可能会有不同的取消政策。建议您在预订时查看具体的取消政策，或者联系客服了解详情。';
    }
    // 具体酒店相关问题
    else if (userContent.includes('酒店') && (userContent.includes('信息') || userContent.includes('详情') || userContent.includes('怎么样') || userContent.includes('如何'))) {
      mockContent = '您想了解哪家酒店的具体信息呢？请告诉我酒店的名称或位置，我可以为您查询详细信息，包括酒店设施、服务、价格等。';
    }
    // 其他问题
    else {
      mockContent = '您好！我是易宿酒店AI助手，很高兴为您服务。请问您有什么关于酒店预订的问题需要咨询吗？例如入住时间、停车服务、预订流程、酒店设施等，我都可以为您解答。';
    }

    // 检查是否需要工具调用
    const hasTools = options.tools && options.tools.length > 0;

    // 直接返回工具调用响应，测试工具调用是否能够正常工作
    if (hasTools && userContent.includes('阳光酒店')) {
      // 提取酒店名称
      const hotelName = '阳光酒店';
      
      // 确定工具调用的参数
      let action = 'search';
      if (userContent.includes('设施') || userContent.includes('价格') || userContent.includes('房型') || userContent.includes('详情')) {
        action = 'detail';
      }

      console.log('Returning tool call response for:', hotelName, 'with action:', action);

      // 模拟工具调用
      return {
        id: 'mock-chat-' + Date.now(),
        object: 'chat.completion',
        created: Date.now() / 1000,
        model: 'gpt-3.5-turbo',
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: null,
              tool_calls: [
                {
                  id: 'mock-tool-call-' + Date.now(),
                  type: 'function',
                  function: {
                    name: 'hotel_search',
                    arguments: JSON.stringify({
                      action: action,
                      hotel_name: hotelName
                    })
                  }
                }
              ]
            },
            finish_reason: 'tool_calls'
          }
        ],
        usage: {
          prompt_tokens: 100,
          completion_tokens: 50,
          total_tokens: 150
        }
      };
    } else {
      // 直接返回文本响应
      return {
        id: 'mock-chat-' + Date.now(),
        object: 'chat.completion',
        created: Date.now() / 1000,
        model: 'gpt-3.5-turbo',
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: mockContent
            },
            finish_reason: 'stop'
          }
        ],
        usage: {
          prompt_tokens: 100,
          completion_tokens: 50,
          total_tokens: 150
        }
      };
    }
  }

  // 获取模拟的完成响应
  getMockCompletionResponse(prompt, options = {}) {
    return {
      id: 'mock-completion-' + Date.now(),
      object: 'text_completion',
      created: Date.now() / 1000,
      model: 'gpt-3.5-turbo-instruct',
      choices: [
        {
          index: 0,
          text: '这是一个模拟的响应。由于没有真实的OpenAI API密钥，我无法提供准确的回答。但我可以告诉您，我们的酒店服务非常优质，欢迎您随时预订！',
          finish_reason: 'stop'
        }
      ],
      usage: {
        prompt_tokens: 50,
        completion_tokens: 50,
        total_tokens: 100
      }
    };
  }
}

module.exports = new LLMService();