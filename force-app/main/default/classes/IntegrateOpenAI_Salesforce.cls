/*
@description       : Class to do Callout to OpenAI for chat completions
@author            : Aditya Sharma (SFDCPro.com)
*/

public with sharing class IntegrateOpenAI_Salesforce {
    private static String OPENAPIKEY = OpenAI_APIKey__c.getValues('OpenAPI').Key__c; //Get API Key stored in Custom Setting
    private static final String ENDPOINTURL ='https://api.openai.com/v1/chat/completions';
    
    @AuraEnabled
    public static String getOpenAIResponse(String messageBody) {
        
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(ENDPOINTURL);
        request.setHeader('Content-Type', 'application/json');
        request.setHeader('Accept', 'application/json');
        request.setHeader('Authorization', 'Bearer ' + OPENAPIKEY);
        request.setMethod('POST');
        Map<String, Object> requestBody = new Map<String, Object>();
        // set this body to get the Response for the Question to Open AI
        requestBody.put('model', 'gpt-3.5-turbo');
        List<Map<String, Object>> messages = new List<Map<String, Object>>();
        Map<String, Object> message = new Map<String, Object>();
        message.put('role', 'user');
        //This is the Question to the Open Ai
        message.put('content', messageBody);
        messages.add(message);
        requestBody.put('messages', messages);
        String requestBodyJson = JSON.serialize(requestBody);
        request.setBody(requestBodyJson);
        HttpResponse response;
        try {
            response = http.send(request);
            if (response.getStatusCode() == 200) {
                FromJSON data = (FromJSON) JSON.deserialize(response.getBody(), FromJSON.class);
                if (data.choices != null && data.choices.size() > 0) {
                    String content = data.choices[0].message.content;
                    system.debug('content: ' + content);
                    return content;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        } catch (Exception ex) {
            System.debug('Exception: ' + ex.getMessage());
            throw ex;
        }
    }
    
    //Wrapper to handle the Api response from the Open Ai Tool
    public class FromJSON {
        public String id;
        public Integer created;
        public String model;
        public List<ClsChoices> choices;
        public ClsUsage usage;
    }
    public class ClsChoices {
        public Integer index;
        public ClsMessage message;
        public String finish_reason;
    }
    public class ClsMessage {
        public String role;
        public String content;
    }
    public class ClsUsage {
        public Integer prompt_tokens;
        public Integer completion_tokens;
        public Integer total_tokens;
    }
}