import { IExecuteFunctions } from 'n8n-workflow';
import { INodeType, INodeTypeDescription } from 'n8n-workflow';

export class LisGetThreadState implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Lis - Get Thread State',
		name: 'lisGetThreadState',
		icon: 'file:assets/icons/lis.png',
		group: ['transform'],
		version: 1,
		description: 'Get the current state of a thread',
		defaults: {
			name: 'Lis - Get Thread State',
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
		],
	};

	async execute(this: IExecuteFunctions) {
		const items = this.getInputData();
		const returnData = [];

		const credentials = (await this.getCredentials('lisApi')) as { url: string };

		for (let i = 0; i < items.length; i++) {
			const threadId = this.getNodeParameter('threadId', i) as string;

			const response = await this.helpers.httpRequest({
				method: 'GET',
				url: `${credentials.url}/agent/threads/${threadId}/state`,
			});

			returnData.push(response);
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
