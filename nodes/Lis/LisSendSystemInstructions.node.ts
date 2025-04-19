import { IExecuteFunctions } from 'n8n-workflow';
import { INodeType, INodeTypeDescription } from 'n8n-workflow';

export class LisSendSystemInstructions implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Lis - Send System Instructions',
		name: 'lisSendSystemInstructions',
		icon: 'file:assets/icons/lis.png',
		group: ['transform'],
		version: 1,
		description: 'Send system instructions to Lis',
		defaults: {
			name: 'Lis - Send System Instructions',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'lisApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Thread ID',
				name: 'threadId',
				type: 'string',
				default: '',
				required: true,
			},
			{
				displayName: 'Data',
				name: 'data',
				type: 'string',
				default: '',
				required: true,
			},
			{
				displayName: 'Chatinterface',
				name: 'chatInterface',
				type: 'options',
				options: [
					{ name: 'API', value: 'api' },
					{ name: 'WhatsApp', value: 'whatsapp' },
				],
				default: 'api',
			},
		],
	};

	async execute(this: IExecuteFunctions) {
		const items = this.getInputData();
		const returnData = [];

		const credentials = (await this.getCredentials('lisApi')) as { url: string };

		for (let i = 0; i < items.length; i++) {
			const threadId = this.getNodeParameter('threadId', i) as string;
			const data = this.getNodeParameter('data', i) as string;
			const chatInterface = this.getNodeParameter('chatInterface', i) as string;

			const body = { thread_id: threadId, data, chat_interface: chatInterface };
			const response = await this.helpers.httpRequest({
				method: 'POST',
				url: `${credentials.url}/agent/messages/system`,
				body,
				json: true,
			});

			returnData.push(response);
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
