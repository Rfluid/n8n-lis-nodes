import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class LisApi implements ICredentialType {
	name = 'lisApi';
	displayName = 'Lis API';
	properties: INodeProperties[] = [
		{
			displayName: 'API URL',
			name: 'url',
			type: 'string',
			default: 'http://localhost:8000',
		},
	];
}