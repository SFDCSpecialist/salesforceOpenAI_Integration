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
