import { IExecuteFunctions } from 'n8n-workflow';
import { INodeType, INodeTypeDescription } from 'n8n-workflow';

export class LisSendChatMessage implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Lis - Send Chat Message',
		name: 'lisSendChatMessage',
		icon: 'file:assets/icons/lis.svg',
		group: ['transform'],
		version: 1,
		description: 'Send chat message to Lis',
		defaults: {
			name: 'Lis - Send Chat Message',
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
				displayName: 'Maximum Retries',
				name: 'maxRetries',
				type: 'number',
				default: 1,
				description:
					'Maximum number of retries for handling the message. AI will try to solve issues this many times.',
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
			const maxRetries = this.getNodeParameter('maxRetries', i) as number;

			const body = {
				thread_id: threadId,
				data,
				max_retries: maxRetries,
				chat_interface: chatInterface,
			};
			const response = await this.helpers.httpRequest({
				method: 'POST',
				url: `${credentials.url}/agent/messages/user`,
				body,
				json: true,
			});

			returnData.push(response);
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
