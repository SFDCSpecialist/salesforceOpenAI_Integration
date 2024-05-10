/*import { LightningElement, track } from 'lwc';
//Importing the Apex method to use in Js Controller
import getOpenAIResponse from '@salesforce/apex/IntegrateOpenAI_Salesforce.getOpenAIResponse';
export default class OpenAIPromptLWC extends LightningElement {
@track question = 'What is Salesforce?';
@track IsSpinner = false;
@track lstData = [];
data;
// this method will be used to store the Input Value in the Variable
handleChange(event) {
    this.question = event.target.value;
    console.log(this.question);
}
//This method is used to call the Apex to send the request to the Open-AI
handleClick() {
    // to start the spinner
    this.IsSpinner = true;
    getOpenAIResponse({ 
        messageBody: this.question 
    })
    .then(
        result => {
            if (result != null) {
            //update the data to the apex response
            this.data = result;
            //to stop the spinner
            this.IsSpinner = false;
            }
        }
    );
}*/
import { LightningElement, track } from 'lwc';
import sendMessageToChatGPT from '@salesforce/apex/IntegrateOpenAI_Salesforce.getOpenAIResponse';

export default class ChatGPTComponent extends LightningElement {
  @track userMessage = '';
  @track chatHistory = '';
  @track isLoading = false;

  handleChange(event) {
    this.userMessage = event.target.value;
  }

  sendMessage() {
    if (this.userMessage.trim()) {
      this.isLoading = true;
      sendMessageToChatGPT({ message: this.userMessage })
        .then(result => {
          this.chatHistory += `You: ${this.userMessage}\nChatGPT: ${result}\n`;
          this.userMessage = '';
          this.isLoading = false;
        })
        .catch(error => {
          console.error('Error sending message to ChatGPT:', error);
          this.isLoading = false;
        });
    }
  }
}
