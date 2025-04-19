import { IExecuteFunctions } from 'n8n-workflow';
import { INodeType, INodeTypeDescription } from 'n8n-workflow';

export class LisDeleteThread implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Lis - Delete Thread',
		name: 'lisDeleteThread',
		icon: 'file:assets/icons/lis.svg',
		group: ['transform'],
		version: 1,
		description: 'Delete a specific thread',
		defaults: {
			name: 'Lis - Delete Thread',
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
				method: 'DELETE',
				url: `${credentials.url}/agent/threads/${threadId}`,
			});

			returnData.push(response);
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}

