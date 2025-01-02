import  run  from "./findData";

async function initiateFlowRun(value:string) {
    const url = "https://api.langflow.astra.datastax.com/lf/ccf6615b-7615-419c-8f3c-d4d14fe37c89/api/v1/run/583f96d7-37df-4b76-9dd7-e4d367394dd5?stream=false";
  
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer AstraCS:ivwdBeNJYhUJiPPeTSaXQwPW:5b395ce3dcf4eb6a563d36736c98519c54f58b63daf1bd7cbc042c6a25312794", 
    };
  
    const body = {
      input_value: value,
      output_type: "chat",
      input_type: "chat",
      tweaks: {
        "ChatInput-2dFP4": {},
        "Prompt-sSYWc": {},
        "ChatOutput-42H9e": {},
        "GoogleGenerativeAIModel-HzlwC": {},
      },
    };
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      const finalV3=data.outputs[0].outputs
      console.log("Flow Run Response:",finalV3[0].artifacts.message);
    } catch (error) {
      console.error("Error initiating flow run:", error);
    }
  }
  
  async function execute() {
    try {
      const info = await run(); 
      const finalData = JSON.stringify(info);
      initiateFlowRun(finalData);
    } catch (error) {
      console.error('Error executing program:', error);
    }
  }

  execute();

  
  