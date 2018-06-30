const { execSync } = require('child_process');
const fs = require('fs');

const config = require('../modules/config');
const http = require('../modules/http');
const util = require('../modules/util');

const upload = async (args) => {
  const [id, , filePath, contentType] = args;

  // Check file exists
  const fullPath = `${process.cwd()}/${filePath}`;
  if (!fs.existsSync(fullPath)) {
    console.log(`\nInvalid file path: ${fullPath}`);
    return;
  }

  // Check it matches the file resource
  const pieces = filePath.split('/');
  const fileName = pieces[pieces.length - 1];
  const { data: existing } = await http.get(`/files/${id}`);
  if (existing.name !== fileName || contentType !== existing.type) {
    console.log('\nEither the file name or MIME type do not match the file ID specified.');
    console.log(`\nFile: ${existing.name} ${existing.type}\nCommand: ${fileName} ${contentType}`);
    return;
  }

  // Upload to S3
  const accessType = existing.privateAccess ? 'private' : 'public-read';
  const stdout = execSync(`curl -X PUT '${existing.uploadUrl}' -H Content-Type:${contentType} -H x-amz-acl:${accessType} --data-binary @${fullPath} --silent`).toString();
  if (stdout.length > 5) {
    console.log(`\nError uploading file data:\n${stdout}`);
    return;
  }

  const { noOutput } = config.get('options');
  if (!noOutput) console.log(`\nFile uploaded successfully.\nLocation: ${existing.contentUrl}`);
};

module.exports = {
  about: 'Work with file resources and upload file data.',
  startsWith: 'file',
  operations: {
    create: {
      execute: async ([, json]) => {
        const payload = await util.buildPayload('FileDocument', json);
        return http.post('/files', payload);
      },
      pattern: 'file create $payload',
    },
    read: {
      execute: async ([id]) => http.get(`/files/${id}`),
      pattern: 'file $id read',
    },
    list: {
      execute: async () => http.get('/files'),
      pattern: 'file list',
    },
    delete: {
      execute: async ([id]) => http.delete(`/files/${id}`),
      pattern: 'file $id delete',
    },
    upload: {
      execute: upload,
      pattern: 'file $id upload $file-path $mime-type',
    },
  },
};
