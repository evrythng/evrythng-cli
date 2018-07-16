const { execSync } = require('child_process');
const fs = require('fs');

const config = require('../modules/config');
const http = require('../modules/http');
const util = require('../modules/util');

const exists = path => new Promise(resolve => fs.exists(path, resolve));

const checkFileExists = async (fullPath) => {
  const fileExists = await exists(fullPath);
  if (!fileExists) {
    throw new Error(`Invalid file path: ${fullPath}`);
  }
};

const checkMetaDataMatches = (existing, filePath, contentType) => {
  const pieces = filePath.split('/');
  const fileName = pieces[pieces.length - 1];
  
  if (existing.name !== fileName || contentType !== existing.type) {
    const errStr = '\nEither the file name or MIME type do not match the file ID specified.' +
      `\nFile: ${existing.name} ${existing.type}\nCommand: ${fileName} ${contentType}`;

    throw new Error(errStr);
  }
};

const uploadToS3 = (existing, fullPath, contentType) => {
  const accessType = existing.privateAccess ? 'private' : 'public-read';
  const cmd = `curl -X PUT '${existing.uploadUrl}' -H Content-Type:${contentType} ` +
    `-H x-amz-acl:${accessType} --data-binary @${fullPath} --silent`;
  
  const stdout = execSync(cmd).toString();
  console.log(stdout);
  if (stdout.length > 5) {
    throw new Error(`\nError uploading file data:\n${stdout}`);
  }
};

const upload = async (args) => {
  const [id, , filePath, contentType] = args;

  const fullPath = `${process.cwd()}/${filePath}`;
  await checkFileExists(fullPath);

  const { data: existing } = await http.get(`/files/${id}`);
  checkMetaDataMatches(existing, filePath, contentType);

  uploadToS3(existing, fullPath, contentType);

  const { noOutput } = config.get('options');
  if (!noOutput) console.log(`\nFile uploaded successfully.\nLocation: ${existing.contentUrl}`);
};

module.exports = {
  about: 'Work with file resources and upload file data.',
  firstArg: 'file',
  operations: {
    create: {
      execute: async ([, json]) => {
        const payload = await util.getPayload('FileDocument', json);
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
