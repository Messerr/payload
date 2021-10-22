import getConfig from '../../config/load';
import { email, password } from '../../mongoose/testCredentials';

require('isomorphic-fetch');

const { serverURL: url } = getConfig();

let token = null;
let headers = null;

describe('Revisions - REST', () => {
  beforeAll(async (done) => {
    const response = await fetch(`${url}/api/admins/login`, {
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'post',
    });

    const data = await response.json();

    ({ token } = data);

    headers = {
      Authorization: `JWT ${token}`,
      'Content-Type': 'application/json',
    };

    done();
  });

  describe('Create', () => {
    it('should allow a new revision to be created', async () => {
      const revision = await fetch(`${url}/api/rich-text`, {
        body: JSON.stringify({
          defaultRichText: [{
            children: [{ text: 'Here is some default rich text content' }],
          }],
          customRichText: [{
            children: [{ text: 'Here is some custom rich text content' }],
          }],
        }),
        headers,
        method: 'post',
      }).then((res) => res.json());

      expect(typeof revision.doc.id).toBe('string');
      expect(revision.doc._status).toBe('draft');
    });
  });
});