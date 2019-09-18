/**
 * (c) Copyright Reserved EVRYTHNG Limited 2018.
 * All rights reserved. Use of this material is subject to license.
 */

const fs = require('fs');
const http = require('../modules/http');
const util = require('../modules/util');

/** List of allowed Reactor script file types */
const SCRIPT_TYPES = ['js'];
/** Type the manifest must be */
const MANIFEST_TYPE = 'json';

/**
 * Get a file extension from a path string.
 *
 * @param {string} path - File path string.
 * @returns {string} The file extension from the last `.` onwards.
 */
const getFileExtension = path => path.split('.').pop();

/**
 * Upload Reactor script file(s) - either just the script, or including the manifest that includes
 * the dependencies.
 *
 * @param {string[]} args - Launch arguments.
 */
const uploadReactorFiles = async ([projectId, , applicationId, , , , scriptPath, manifestPath]) => {
  if (!SCRIPT_TYPES.includes(getFileExtension(scriptPath))) {
    throw new Error(`File type must be one of ${SCRIPT_TYPES.join(', ')}`);
  }

  const script = fs.readFileSync(scriptPath, 'utf8');
  const payload = { script };
  if (manifestPath) {
    if (getFileExtension(manifestPath) !== MANIFEST_TYPE) {
      throw new Error(`Manifest must be a .${MANIFEST_TYPE} file, normally package.json`);
    }

    payload.manifest = fs.readFileSync(manifestPath, 'utf8');
  }

  const url = `/projects/${projectId}/applications/${applicationId}/reactor/script`;
  return http.put(url, payload);
};

module.exports = {
  about: 'Work with project and application resources.',
  firstArg: 'projects',
  operations: {
    // CRUD projects
    createProject: {
      execute: async ([, json]) => {
        const payload = await util.getPayload('ProjectDocument', json);
        return http.post('/projects', payload);
      },
      pattern: 'create $payload',
      helpPattern: 'create [$payload|--build]',
    },
    listProject: {
      execute: async () => http.get('/projects'),
      pattern: 'list',
    },
    readProject: {
      execute: async ([projectId]) => http.get(`/projects/${projectId}`),
      pattern: '$id read',
    },
    updateProject: {
      execute: async ([projectId, , json]) => http.put(`/projects/${projectId}`, JSON.parse(json)),
      pattern: '$id update $payload',
    },
    deleteProject: {
      execute: async ([projectId]) => http.delete(`/projects/${projectId}`),
      pattern: '$id delete',
    },

    // CRUD applications
    createApplication: {
      execute: async ([projectId, , , json]) => {
        const payload = await util.getPayload('ApplicationDocument', json);
        return http.post(`/projects/${projectId}/applications`, payload);
      },
      pattern: '$id applications create $payload',
      helpPattern: '$id applications create [$payload|--build]',
    },
    listApplication: {
      execute: async ([projectId]) => http.get(`/projects/${projectId}/applications`),
      pattern: '$id applications list',
    },
    readApplication: {
      execute: async ([projectId, , applicationId]) => {
        const url = `/projects/${projectId}/applications/${applicationId}`;
        return http.get(url);
      },
      pattern: '$id applications $id read',
    },
    updateApplication: {
      execute: async ([projectId, , applicationId, , json]) => {
        const url = `/projects/${projectId}/applications/${applicationId}`;
        return http.put(url, JSON.parse(json));
      },
      pattern: '$id applications $id update $payload',
    },
    deleteApplication: {
      execute: async ([projectId, , applicationId]) => {
        const url = `/projects/${projectId}/applications/${applicationId}`;
        return http.delete(url);
      },
      pattern: '$id applications $id delete',
    },

    // Trusted API Key
    readApplicationTrustedKey: {
      execute: async ([projectId, , applicationId]) => {
        const url = `/projects/${projectId}/applications/${applicationId}/secretKey`;
        return http.get(url);
      },
      pattern: '$id applications $id secret-key read',
    },

    // Application Redirector
    readApplicationRedirector: {
      execute: async ([projectId, , applicationId]) => {
        const url = `/projects/${projectId}/applications/${applicationId}/redirector`;
        return http.get(url);
      },
      pattern: '$id applications $id redirector read',
    },
    updateApplicationRedirector: {
      execute: async ([projectId, , applicationId, , , json]) => {
        const url = `/projects/${projectId}/applications/${applicationId}/redirector`;
        return http.put(url, JSON.parse(json));
      },
      pattern: '$id applications $id redirector update $payload',
    },

    // Reactor script
    readReactorScript: {
      execute: async ([projectId, , applicationId]) => {
        const url = `/projects/${projectId}/applications/${applicationId}/reactor/script`;
        return http.get(url);
      },
      pattern: '$id applications $id reactor script read',
    },
    updateReactorScript: {
      execute: async ([projectId, , applicationId, , , , json]) => {
        const url = `/projects/${projectId}/applications/${applicationId}/reactor/script`;
        return http.put(url, JSON.parse(json));
      },
      pattern: '$id applications $id reactor script update $payload',
    },
    uploadReactorScript: {
      execute: uploadReactorFiles,
      pattern: '$id applications $id reactor script upload $scriptPath $manifestPath',
      helpPattern: '$id applications $id reactor script upload $scriptPath [$manifestPath]',
    },
    readReactorScriptStatus: {
      execute: async ([projectId, , applicationId]) => {
        const url = `/projects/${projectId}/applications/${applicationId}/reactor/script/status`;
        return http.get(url);
      },
      pattern: '$id applications $id reactor script status read',
    },

    // Reactor logs
    readReactorLogs: {
      execute: async ([projectId, , applicationId]) => {
        const url = `/projects/${projectId}/applications/${applicationId}/reactor/logs`;
        return http.get(url);
      },
      pattern: '$id applications $id reactor logs read',
    },
    deleteReactorLogs: {
      execute: async ([projectId, , applicationId]) => {
        const url = `/projects/${projectId}/applications/${applicationId}/reactor/logs`;
        return http.delete(url);
      },
      pattern: '$id applications $id reactor logs delete',
    },

    // Reactor schedules
    createReactorSchedule: {
      execute: async ([projectId, , applicationId, , , , json]) => {
        const url = `/projects/${projectId}/applications/${applicationId}/reactor/schedules`;
        return http.post(url, JSON.parse(json));
      },
      pattern: '$id applications $id reactor schedules create $payload',
    },
    listReactorSchedules: {
      execute: async ([projectId, , applicationId]) => {
        const url = `/projects/${projectId}/applications/${applicationId}/reactor/schedules`;
        return http.get(url);
      },
      pattern: '$id applications $id reactor schedules list',
    },
    readReactorSchedule: {
      execute: async ([projectId, , applicationId, , , scheduleId]) => {
        const url = `/projects/${projectId}/applications/${applicationId}/reactor/schedules/${scheduleId}`;
        return http.get(url);
      },
      pattern: '$id applications $id reactor schedules $id read',
    },
    updateReactorSchedule: {
      execute: async ([projectId, , applicationId, , , scheduleId, , json]) => {
        const url = `/projects/${projectId}/applications/${applicationId}/reactor/schedules/${scheduleId}`;
        return http.put(url, JSON.parse(json));
      },
      pattern: '$id applications $id reactor schedules $id update $payload',
    },
    deleteReactorSchedule: {
      execute: async ([projectId, , applicationId, , , scheduleId]) => {
        const url = `/projects/${projectId}/applications/${applicationId}/reactor/schedules/${scheduleId}`;
        return http.delete(url);
      },
      pattern: '$id applications $id reactor schedules $id delete',
    },
  },
};
