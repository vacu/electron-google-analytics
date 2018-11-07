import { net } from 'electron';
import formurlencoded from 'form-urlencoded';

function copyResponse(response) {
  const { headers, statusCode } = response;
  const contentType = headers['content-type'][0];
  headers['content-type'] = contentType;
  return {
    statusCode,
    headers
  };
}

function post(options, requestCallback, electronOpts) {
  const { url, form } = options;
  const { partition, session } = electronOpts;

  const formString = formurlencoded(form);
  const headers = options.headers || {};
  headers['content-type'] = 'application/x-www-form-urlencoded';
  headers['content-length'] = formString.length;

  try {
    const req = net.request({
      headers,
      method: 'POST',
      url,
      session,
      partition
    });

    return new Promise((resolve, reject) => {
      req.on('response', (response) => {
        const chunks = [];

        response.on('data', (chunk) => {
          chunks.push(chunk);
        });

        response.on('error', (error) => {
          requestCallback(error, copyResponse(response));
          reject(error);
        });

        response.on('end', () => {
          const body = Buffer.concat(chunks).toString('utf8');
          try {
            requestCallback(null, copyResponse(response), body);
          } catch (error) {
            requestCallback(error);
            reject(error);
          }
          resolve(body);
        });
      });

      req.on('error', (error) => {
        requestCallback(error);
        reject(error);
      });

      req.write(formString);
      req.end();
    });
  } catch (error) {
    requestCallback(error);
    return Promise.reject(error);
  }
}

export default function electronAdapter(electronOpts) {
  return {
    post: (options, requestCallback) => post(options, requestCallback, electronOpts)
  };
}
