function ChatGPT(OPENAI_API_KEY, prompt, mission, max, model, temperature) {
  const url = "https://api.openai.com/v1/chat/completions";
  const payload = {
    model: model || "gpt-3.5-turbo",
    messages: [
      { role: "system", content: mission },
      { role: "user", content: prompt },
    ],
    temperature: temperature || 0.3,
    max_tokens: max || 500,
  };
  const options = {
    method: 'post',
    contentType: "application/json",
    headers: { Authorization: "Bearer " + OPENAI_API_KEY },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true  // 避免在發生HTTP錯誤時拋出異常
  };

  let attempts = 0;
  while (attempts < 3) {
    try {
      const response = UrlFetchApp.fetch(url, options);
      if (response.getResponseCode() === 200) {
        // 如果請求成功，解析返回的數據並返回
        const res = JSON.parse(response.getContentText());
        return res.choices[0].message.content.trim();
      } else {
        // 如果請求失敗，記錄錯誤並且在一秒後重試
        console.error(`Attempt ${attempts + 1}: Failed to fetch data. Status code: ${response.getResponseCode()}`);
        Utilities.sleep(1000);  // 等待一秒
        attempts++;
      }
    } catch (error) {
      // 捕獲異常並且在一秒後重試
      console.error(`Attempt ${attempts + 1}: Error during fetch operation. Error: ${error}`);
      Utilities.sleep(1000);
      attempts++;
    }
  }

  throw new Error("Failed to fetch data after 3 attempts.");
}



function ChatGPT_JSON(prompt, mission , max ,model , temperature) {
  //gpt-4-1106-preview
  //gpt-3.5-turbo-1106
  const url = "https://api.openai.com/v1/chat/completions";
  const payload = {
    model: model|| "gpt-3.5-turbo-1106",
    response_format: { "type": "json_object" },
    messages: [
      { role: "system", content: mission ||'You are a helpful assistant designed to output JSON.'},
      { role: "user", content: prompt },
    ],
    temperature: temperature || 0.3,
    max_tokens: max || 500,
  };
  const options = {
    contentType: "application/json",
    headers: { Authorization: "Bearer " + OPENAI_API_KEY },
    payload: JSON.stringify(payload),
  };


  const res = JSON.parse(UrlFetchApp.fetch(url, options).getContentText());
  return res.choices[0].message.content.trim();
}


function ChatGPTv2(OPENAI_API_KEY, prompt, mission, max, model, temperature, logitBias) {
  const url = "https://api.openai.com/v1/chat/completions";
  const payload = {
    model: model || "gpt-3.5-turbo",
    response_format: { "type": "json_object" },
    messages: [
      { role: "system", content: mission },
      { role: "user", content: prompt },
    ],
    temperature: temperature || 0.3,
    max_tokens: max || 500,
    logit_bias: logitBias || {},  // 加入 logit_bias，如果提供的话
  };
  const options = {
    method: 'post',
    contentType: "application/json",
    headers: { Authorization: "Bearer " + OPENAI_API_KEY },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true  // 避免在发生HTTP错误时抛出异常
  };

  let attempts = 0;
  while (attempts < 3) {
    try {
      const response = UrlFetchApp.fetch(url, options);
      if (response.getResponseCode() === 200) {
        // 如果请求成功，解析返回的数据并返回
        const res = JSON.parse(response.getContentText());
        return res.choices[0].message.content.trim();
      } else {
        // 如果请求失败，记录错误并且在一秒后重试
        console.error(`Attempt ${attempts + 1}: Failed to fetch data. Status code: ${response.getResponseCode()}`);
        Utilities.sleep(1000);  // 等待一秒
        attempts++;
      }
    } catch (error) {
      // 捕获异常并且在一秒后重试
      console.error(`Attempt ${attempts + 1}: Error during fetch operation. Error: ${error}`);
      Utilities.sleep(1000);
      attempts++;
    }
  }

  throw new Error("Failed to fetch data after 3 attempts.");
}
