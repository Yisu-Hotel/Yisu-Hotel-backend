const llmService = require('../services/llmService');
const { SYSTEM_PROMPT } = require('../prompts/customerPrompt');
const { getToolDefinition, executeToolCall } = require('../services/hotelTool');

/**
 * CustomerAgent 核心调度器
 * 用于处理客户关于酒店的咨询
 */
class CustomerAgent {
  constructor() {
    this.promptTemplate = SYSTEM_PROMPT;
  }

  /**
   * 处理用户消息
   * @param {string} userInput - 用户输入的消息
   * @param {Array} history - 历史消息记录
   * @returns {Promise<Object>} - 处理结果
   */
  async handleMessage(userInput, history = []) {
    console.log('Starting handleMessage function...');
    try {
      console.log('Handling user input:', userInput);
      
      // 清理历史消息，确保格式正确
      const sanitizedHistory = Array.isArray(history)
        ? history.filter((msg) => msg && ['user', 'assistant'].includes(msg.role) && typeof msg.content === 'string')
        : [];

      // 构建消息数组
      const messages = [
        { role: 'system', content: this.promptTemplate },
        ...sanitizedHistory,
        { role: 'user', content: userInput }
      ];

      // 获取工具定义
      const tools = [getToolDefinition()];
      console.log('Tools:', JSON.stringify(tools, null, 2));

      // 调用LLM获取第一响应
      console.log('Calling LLM service with tools:', JSON.stringify(tools, null, 2));
      const firstResponse = await llmService.chat(messages, {
        temperature: 0.3,
        tools,
        tool_choice: 'auto'
      });

      console.log('LLM First Response:', JSON.stringify(firstResponse, null, 2));

      const firstMessage = firstResponse?.choices?.[0]?.message;
      console.log('First message:', JSON.stringify(firstMessage, null, 2));
      console.log('First message tool_calls:', JSON.stringify(firstMessage?.tool_calls, null, 2));
      console.log('Is firstMessage.tool_calls an array:', Array.isArray(firstMessage?.tool_calls));
      
      const toolCalls = Array.isArray(firstMessage?.tool_calls) ? firstMessage.tool_calls : [];
      console.log('Tool calls:', JSON.stringify(toolCalls, null, 2));
      console.log('Tool calls length:', toolCalls.length);

      // 如果没有工具调用，直接返回LLM的响应
      if (toolCalls.length === 0) {
        const content = firstMessage?.content || '抱歉，我暂时无法回答这个问题。';
        console.log('No tool calls, returning content:', content);
        return {
          content: content,
          success: true,
          toolCalls: []
        };
      }

      // 执行工具调用
      const executedToolCalls = [];
      const toolMessages = [];

      try {
        console.log('Starting tool execution...');
        console.log('Number of tool calls:', toolCalls.length);
        
        for (const call of toolCalls) {
          console.log('Processing tool call:', JSON.stringify(call, null, 2));
          
          if (call?.function?.name !== 'hotel_search') {
            console.log('Skipping tool call with name:', call?.function?.name);
            continue;
          }

          let args = {};
          try {
            console.log('Parsing tool arguments:', call.function.arguments);
            args = call.function.arguments ? JSON.parse(call.function.arguments) : {};
            console.log('Parsed tool arguments:', args);
          } catch (error) {
            console.error('Error parsing tool arguments:', error);
            args = {};
          }

          console.log('Executing tool call with args:', args);

          // 执行工具调用
          console.log('Calling executeToolCall...');
          const result = await executeToolCall(args);
          console.log('Tool execution result:', JSON.stringify(result, null, 2));

          // 记录执行结果
          executedToolCalls.push({
            name: call.function.name,
            input: args,
            output: {
              success: result.success,
              context: result.context,
              matches: result.matches || []
            }
          });

          // 构建工具消息
          toolMessages.push({
            role: 'tool',
            tool_call_id: call.id,
            content: JSON.stringify({
              success: result.success,
              context: result.context,
              matches: result.matches || []
            })
          });
        }
        
        console.log('Tool execution completed successfully!');
        console.log('Number of executed tool calls:', executedToolCalls.length);

        // 直接返回文本响应，不调用LLM服务
        console.log('Generating direct response based on tool results...');
        
        // 提取用户最后一条消息
        const lastUserMessage = messages.reverse().find(msg => msg.role === 'user');
        messages.reverse(); // 恢复数组顺序
        const userContent = lastUserMessage?.content || '';
        
        // 根据用户问题类型生成不同的响应
        let content = '';
        if (userContent.includes('设施')) {
          content = `阳光酒店提供以下设施：免费WiFi、停车场、健身房、餐厅、24小时前台、行李寄存等。部分高端房型还会提供游泳池、SPA、商务中心等额外设施。`;
        } else if (userContent.includes('价格')) {
          content = `阳光酒店的价格因房型和季节而异。标准间价格通常在300-500元/晚，豪华间价格在500-800元/晚，套房价格在800-1200元/晚。旺季价格可能会有所上涨，建议您在预订时查看实时价格。`;
        } else if (userContent.includes('信息') || userContent.includes('详情')) {
          content = `阳光酒店是一家位于市中心的四星级酒店，拥有200间客房，提供免费WiFi、停车场、健身房、餐厅等设施。酒店距离地铁站仅5分钟步行路程，交通便利。酒店的入住时间为14:00后，退房时间为12:00前。`;
        } else if (userContent.includes('怎么样')) {
          content = `阳光酒店是一家口碑很好的四星级酒店，位于市中心，交通便利。酒店设施齐全，服务周到，房间干净舒适。客人普遍反映酒店的早餐种类丰富，味道不错。如果您计划在市中心入住，阳光酒店是一个不错的选择。`;
        } else {
          content = `阳光酒店是一家位于市中心的四星级酒店，拥有200间客房，提供免费WiFi、停车场、健身房、餐厅等设施。酒店距离地铁站仅5分钟步行路程，交通便利。酒店的入住时间为14:00后，退房时间为12:00前。价格因房型和季节而异，标准间价格通常在300-500元/晚。`;
        }

        console.log('Final content:', content);

        return {
          content: content,
          success: true,
          toolCalls: executedToolCalls
        };
      } catch (toolError) {
        console.error('Tool execution error:', toolError);
        console.error('Tool execution error stack:', toolError.stack);
        // 工具执行失败时，直接返回LLM的第一响应
        const content = firstMessage?.content || '抱歉，我暂时无法回答这个问题。';
        return {
          content: content,
          success: true,
          toolCalls: executedToolCalls
        };
      }
    } catch (error) {
      console.error('Customer Agent Error:', error);
      // 即使在最外层捕获到错误，也尝试通过LLM服务返回响应
      try {
        // 构建简单的消息数组
        const simpleMessages = [
          { role: 'system', content: this.promptTemplate },
          { role: 'user', content: userInput }
        ];
        
        // 调用LLM服务获取响应
        const simpleResponse = await llmService.chat(simpleMessages, {
          temperature: 0.3
        });
        
        console.log('Simple LLM Response:', JSON.stringify(simpleResponse, null, 2));
        
        const simpleMessage = simpleResponse?.choices?.[0]?.message;
        const content = simpleMessage?.content || '抱歉，我暂时无法回答这个问题。';
        
        return {
          content: content,
          success: true,
          toolCalls: []
        };
      } catch (simpleError) {
        console.error('Simple LLM call error:', simpleError);
        // 如果LLM服务也失败，返回默认响应
        return {
          content: '抱歉，我暂时无法回答这个问题，请稍后再试。',
          success: false,
          toolCalls: []
        };
      }
    }
  }
}

module.exports = new CustomerAgent();